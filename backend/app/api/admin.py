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
