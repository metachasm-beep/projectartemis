from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import uuid
from app.supabase import supabase_client

router = APIRouter(prefix="/admin", tags=["admin"])

class BanRequest(BaseModel):
    user_id: uuid.UUID
    reason: str

class TakedownRequest(BaseModel):
    user_id: uuid.UUID
    content_type: str # 'photos', 'bio', 'all'
    reason: str

@router.post("/ban-user")
async def ban_user(request: BanRequest):
    """
    Matriarch Council: Permanent ban. 
    Disables the user in public.users and shadowbans in rank profiles.
    """
    # 1. Disable User record
    supabase_client.table("users").update({
        "is_active": False,
        "is_banned": True
    }).eq("id", str(request.user_id)).execute()

    # 2. Shadowban in male_rank_profiles (if exists)
    supabase_client.table("male_rank_profiles").update({
        "is_shadowbanned": True,
        "is_visible": False
    }).eq("user_id", str(request.user_id)).execute()

    # 3. Log the action for regulatory audit
    supabase_client.table("reports").insert({
        "reported_id": str(request.user_id),
        "reason": f"ADMIN_BAN: {request.reason}",
        "status": "resolved"
    }).execute()

    return {"status": "banned", "user_id": request.user_id}

@router.post("/takedown")
async def takedown_content(request: TakedownRequest):
    """
    Matriarch Council: Forced content removal.
    """
    update_data = {}
    if request.content_type == 'photos':
        update_data = {"photos": []}
    elif request.content_type == 'bio':
        update_data = {"bio": "[CONTENT REMOVED BY MODERATION]"}
    elif request.content_type == 'all':
        update_data = {"photos": [], "bio": "[ACCOUNT SUSPENDED]"}

    if update_data:
        supabase_client.table("profiles").update(update_data).eq("user_id", str(request.user_id)).execute()

    # Log forensic event
    supabase_client.table("reports").insert({
        "reported_id": str(request.user_id),
        "reason": f"ADMIN_TAKEDOWN ({request.content_type}): {request.reason}",
        "status": "resolved"
    }).execute()

    return {"status": "takedown_complete"}

@router.get("/profiles")
async def get_all_profiles():
    """
    Steward View: Fetch all profiles for visual curation.
    """
    res = supabase_client.table("profiles").select("user_id, full_name, photos, role, created_at").order("created_at", desc=True).execute()
    return res.data

@router.delete("/user/{user_id}")
async def hard_delete_user(user_id: uuid.UUID):
    """
    Council Judgment: Permanent eviction of an identity.
    """
    # 1. Delete from profiles (cascades or manual depending on schema)
    supabase_client.table("profiles").delete().eq("user_id", str(user_id)).execute()
    
    # 2. Delete from users (The root record)
    supabase_client.table("users").delete().eq("id", str(user_id)).execute()

    # 3. Cleanup specific rank tables if applicable
    supabase_client.table("male_rank_profiles").delete().eq("user_id", str(user_id)).execute()

    return {"status": "evicted", "user_id": user_id}

@router.post("/bulk-dedupe")
async def bulk_dedupe():
    """
    Purge Protocol: Automated removal of visual asset clones.
    Keeps the oldest profile for every unique photo set.
    """
    # This is a heavy operation, effectively mirroring the script logic I used earlier.
    # In a production environment, this would be an background task.
    profiles = supabase_client.table("profiles").select("user_id, photos, created_at").execute().data
    
    photo_map = {}
    deleted_count = 0
    
    for p in profiles:
        photo_url = p['photos'][0] if p['photos'] and len(p['photos']) > 0 else None
        if not photo_url: continue
        
        if photo_url in photo_map:
            # Duplicate found. Check which one is older.
            existing = photo_map[photo_url]
            if p['created_at'] < existing['created_at']:
                # New one is older? Keep this and delete the other.
                await hard_delete_user(uuid.UUID(existing['user_id']))
                photo_map[photo_url] = p
                deleted_count += 1
            else:
                # Existing is older. Delete current.
                await hard_delete_user(uuid.UUID(p['user_id']))
                deleted_count += 1
        else:
            photo_map[photo_url] = p
            
    return {"status": "purged", "deleted_count": deleted_count}
