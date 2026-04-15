from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.security import auth_bearer
from datetime import datetime
import json
import uuid

router = APIRouter(prefix="/admin", tags=["admin"])

class BanRequest(BaseModel):
    user_id: str
    reason: str

class TakedownRequest(BaseModel):
    user_id: str
    content_type: str # 'photos', 'bio', 'all'
    reason: str

# 🛡️ SOVEREIGN OVERSIGHT DEPENDENCY
def require_admin(user: dict = Depends(auth_bearer)):
    """Enforces administrative role-based access for 'The Protocol' v2.4."""
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Administrative clearance required for this operation."
        )
    return user

@router.post("/ban-user")
async def ban_user(request: BanRequest, admin: dict = Depends(require_admin)):
    """
    Matriarch Council Oversight: Permanent exclusion from the Registry.
    Logged and audited under the Sovereign Administrative session.
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
    report_id = f"ban_{uuid.uuid4().hex[:8]}"
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, status) VALUES (?, ?, ?, ?, 'resolved')",
        [report_id, admin["id"], request.user_id, f"ADMIN_BAN: {request.reason}"]
    )

    return {"status": "banned", "user_id": request.user_id, "authorized_by": admin["id"]}

@router.post("/takedown")
async def takedown_content(request: TakedownRequest, admin: dict = Depends(require_admin)):
    """Council Judgment: Strategic content excision."""
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

    report_id = f"td_{uuid.uuid4().hex[:8]}"
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, status) VALUES (?, ?, ?, ?, 'resolved')",
        [report_id, admin["id"], request.user_id, f"TAKEDOWN ({request.content_type}): {request.reason}"]
    )

    return {"status": "takedown_complete", "user_id": request.user_id}

@router.get("/profiles")
async def get_all_profiles(admin: dict = Depends(require_admin)):
    """Full Registry Auditing view for Matriarch Stewards."""
    res = await turso_client.execute(
        "SELECT user_id, full_name, photos, role, created_at FROM profiles ORDER BY created_at DESC"
    )
    return res.rows

@router.delete("/user/{user_id}")
async def hard_delete_user(user_id: str, admin: dict = Depends(require_admin)):
    """Permanent eviction logic for 'The Protocol' v2.4."""
    await turso_client.execute("DELETE FROM profiles WHERE user_id = ?", [user_id])
    return {"status": "evicted", "user_id": user_id, "auditor": admin["id"]}

@router.post("/bulk-dedupe")
async def bulk_dedupe(admin: dict = Depends(require_admin)):
    """Automated visual parity purge logic."""
    # Fetch all with photos
    res = await turso_client.execute("SELECT user_id, photos, created_at FROM profiles WHERE role = 'man'")
    
    photo_map = {}
    deleted_count = 0
    
    for p in res.rows:
        try:
            photos = json.loads(p.get("photos", "[]"))
            photo_url = photos[0] if photos else None
        except:
            photo_url = None
            
        if not photo_url: continue
        
        if photo_url in photo_map:
            existing = photo_map[photo_url]
            if p['created_at'] < existing['created_at']:
                await turso_client.execute("DELETE FROM profiles WHERE user_id = ?", [existing['user_id']])
                photo_map[photo_url] = p
                deleted_count += 1
            else:
                await turso_client.execute("DELETE FROM profiles WHERE user_id = ?", [p['user_id']])
                deleted_count += 1
        else:
            photo_map[photo_url] = p
            
    return {"status": "purged", "deleted_count": deleted_count, "triggered_by": admin["id"]}
