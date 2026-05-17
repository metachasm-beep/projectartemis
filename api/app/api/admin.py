from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import auth_bearer
from app.api.deps import (
    get_sanctuary_service,
    get_influencer_service,
    get_payment_service,
    get_profile_repo,
    SanctuaryService,
    InfluencerService,
    PaymentService,
    TursoProfileRepository
)
from datetime import datetime
import json
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"])

class BanRequest(BaseModel):
    user_id: str
    reason: str

class TakedownRequest(BaseModel):
    user_id: str
    content_type: str # 'photos', 'bio', 'all'
    reason: str

class CreateCouponRequest(BaseModel):
    influencer_user_id: str
    code: str            # e.g. 'SAKSHAM50'
    discount_pct: int = 50

class ApproveClaimRequest(BaseModel):
    user_id: str
    utr: str
    jump_type: str       # 'nudge' | 'surge' | 'elite'
    city: str
    coupon_code: str = ""   # Optional promo code

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
async def ban_user(
    request: BanRequest, 
    admin: dict = Depends(require_admin),
    profile_repo: TursoProfileRepository = Depends(get_profile_repo),
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """
    Matriarch Council Oversight: Permanent exclusion from the Registry.
    Logged and audited under the Sovereign Administrative session.
    """
    await profile_repo.ban_profile(request.user_id)
    await sanctuary_service.report_user(admin["id"], request.user_id, f"ADMIN_BAN: {request.reason}")
    return {"status": "banned", "user_id": request.user_id, "authorized_by": admin["id"]}

@router.post("/takedown")
async def takedown_content(
    request: TakedownRequest, 
    admin: dict = Depends(require_admin),
    profile_repo: TursoProfileRepository = Depends(get_profile_repo),
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """Council Judgment: Strategic content excision."""
    update_data = {}
    if request.content_type == 'photos':
        update_data["photos"] = '[]'
    elif request.content_type == 'bio':
        update_data["bio"] = '[CONTENT REMOVED BY MODERATION]'
    elif request.content_type == 'all':
        update_data["photos"] = '[]'
        update_data["bio"] = '[ACCOUNT SUSPENDED]'

    await profile_repo.update_profile(request.user_id, update_data)
    await sanctuary_service.report_user(admin["id"], request.user_id, f"TAKEDOWN ({request.content_type}): {request.reason}")

    return {"status": "takedown_complete", "user_id": request.user_id}

@router.get("/profiles")
async def get_all_profiles(
    admin: dict = Depends(require_admin), 
    query: str = "",
    profile_repo: TursoProfileRepository = Depends(get_profile_repo)
):
    """Full Registry Auditing view for Matriarch Stewards. Supports optional ?query= filter by name."""
    return await profile_repo.get_all_profiles(query)

@router.delete("/user/{user_id}")
async def hard_delete_user(
    user_id: str, 
    admin: dict = Depends(require_admin),
    profile_repo: TursoProfileRepository = Depends(get_profile_repo)
):
    """Permanent eviction logic for 'The Protocol' v2.4."""
    await profile_repo.delete_profile(user_id)
    return {"status": "evicted", "user_id": user_id, "auditor": admin["id"]}


# ─── INFLUENCER MANAGEMENT ────────────────────────────────────────────────────

@router.post("/influencer/create-coupon")
async def create_influencer_coupon(
    request: CreateCouponRequest, 
    admin: dict = Depends(require_admin),
    influencer_service: InfluencerService = Depends(get_influencer_service)
):
    """
    Admin: Create a unique promo coupon for an influencer.
    Also marks the target profile as is_influencer = 1.
    """
    res = await influencer_service.create_coupon(
        request.code, request.influencer_user_id, request.discount_pct, admin["id"]
    )
    if res.get("status") == "error":
        raise HTTPException(status_code=400, detail=res["message"])
    return res

@router.get("/influencer/list")
async def list_influencers(
    admin: dict = Depends(require_admin),
    influencer_service: InfluencerService = Depends(get_influencer_service)
):
    """Admin: List all influencers with their coupon codes and earnings stats."""
    # Leveraging the repo method directly or via service
    influencers = await influencer_service.coupon_repo.get_influencers_with_stats()
    return {"influencers": influencers}

@router.post("/influencer/toggle-coupon")
async def toggle_coupon_status(
    request: dict, 
    admin: dict = Depends(require_admin),
    influencer_service: InfluencerService = Depends(get_influencer_service)
):
    """Admin: Activate or deactivate a coupon code."""
    code = request.get("code", "").upper()
    is_active = request.get("is_active", True)
    await influencer_service.coupon_repo.update_coupon_status(code, is_active)
    return {"code": code, "is_active": is_active}


@router.post("/payments/approve-claim")
async def approve_payment_claim(
    request: ApproveClaimRequest, 
    admin: dict = Depends(require_admin),
    payment_service: PaymentService = Depends(get_payment_service)
):
    """
    Admin: Approve a pending UTR payment claim.
    If a coupon_code is present, fires the 10% influencer commission.
    """
    res = await payment_service.approve_claim(request.utr, admin["id"])
    if res.get("status") == "error":
        raise HTTPException(status_code=400, detail=res["message"])
    return res

@router.post("/bulk-dedupe")
async def bulk_dedupe(
    admin: dict = Depends(require_admin),
    profile_repo: TursoProfileRepository = Depends(get_profile_repo)
):
    """Automated visual parity purge logic."""
    profiles = await profile_repo.get_men_with_photos()
    
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
            if p['created_at'] < existing['created_at']:
                await profile_repo.delete_profile(existing['user_id'])
                photo_map[photo_url] = p
                deleted_count += 1
            else:
                await profile_repo.delete_profile(p['user_id'])
                deleted_count += 1
        else:
            photo_map[photo_url] = p
            
    return {"status": "purged", "deleted_count": deleted_count, "triggered_by": admin["id"]}
