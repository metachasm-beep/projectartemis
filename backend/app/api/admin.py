from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.db.turso import turso_client
from datetime import datetime
import json

router = APIRouter(prefix="/admin", tags=["admin"])

class BanRequest(BaseModel):
    user_id: str
    reason: str

class TakedownRequest(BaseModel):
    user_id: str
    content_type: str # 'photos', 'bio', 'all'
    reason: str

@router.post("/ban-user")
async def ban_user(request: BanRequest):
    """
    Matriarch Council: Permanent ban on the Registry.
    """
    # 1. Disable Profile and reset ranking
    await turso_client.execute(
        "UPDATE profiles SET onboarding_status = 'BANNED', rank_score = 0, points = 0 WHERE user_id = ?",
        [request.user_id]
    )

    # 2. Update specific male rank profile visibility
    await turso_client.execute(
        "UPDATE male_rank_profiles SET rank_score = 0 WHERE user_id = ?",
        [request.user_id]
    )

    # 3. Log the audit event
    report_id = f"ban_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO reports (id, reported_id, reason, status) VALUES (?, ?, ?, 'resolved')",
        [report_id, request.user_id, f"ADMIN_BAN: {request.reason}"]
    )

    return {"status": "banned", "user_id": request.user_id}

@router.post("/takedown")
async def takedown_content(request: TakedownRequest):
    """
    Council Judgment: Forceful content scrub.
    """
    sql = "UPDATE profiles SET updated_at = CURRENT_TIMESTAMP"
    params = []
    
    if request.content_type == 'photos':
        sql += ", photos = '[]'"
    elif request.content_type == 'bio':
        sql += ", bio = '[CONTENT REMOVED BY MODERATION]'"
    elif request.content_type == 'all':
        sql += ", photos = '[]', bio = '[ACCOUNT SUSPENDED]'"

    sql += " WHERE user_id = ?"
    params.append(request.user_id)

    await turso_client.execute(sql, params)

    # Log forensic event
    report_id = f"td_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO reports (id, reported_id, reason, status) VALUES (?, ?, ?, 'resolved')",
        [report_id, request.user_id, f"TAKEDOWN ({request.content_type}): {request.reason}"]
    )

    return {"status": "takedown_complete"}

@router.get("/profiles")
async def get_all_profiles():
    """Steward view of all Registry identities."""
    res = await turso_client.execute("SELECT user_id, full_name, photos, role, created_at FROM profiles ORDER BY created_at DESC")
    return res

@router.delete("/user/{user_id}")
async def hard_delete_user(user_id: str):
    """Permanent eviction from the Registry."""
    # SQLite/LibSQL with ON DELETE CASCADE will handle resonances/events if foreign keys are set
    await turso_client.execute("DELETE FROM profiles WHERE user_id = ?", [user_id])
    return {"status": "evicted", "user_id": user_id}

@router.post("/bulk-dedupe")
async def bulk_dedupe():
    """Purge Protocol: Automated removal of visual asset clones."""
    # Fetch all with photos
    profiles = await turso_client.execute("SELECT user_id, photos, created_at FROM profiles WHERE role = 'man'")
    
    photo_map = {}
    deleted_count = 0
    
    for p in profiles:
        try:
            photos = json.loads(p.get("photos", "[]"))
            photo_url = photos[0] if photos else None
        except:
            photo_url = None
            
        if not photo_url: continue
        
        if photo_url in photo_map:
            existing = photo_map[photo_url]
            # Keep the oldest
            if p['created_at'] < existing['created_at']:
                await hard_delete_user(existing['user_id'])
                photo_map[photo_url] = p
                deleted_count += 1
            else:
                await hard_delete_user(p['user_id'])
                deleted_count += 1
        else:
            photo_map[photo_url] = p
            
    return {"status": "purged", "deleted_count": deleted_count}
