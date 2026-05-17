from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import auth_bearer
from app.api.deps import get_influencer_service, InfluencerService
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/influencer", tags=["Influencer"])

# ─── Dependency: Require Influencer ───────────────────────────────────────────

def require_influencer(user: dict = Depends(auth_bearer)):
    """Enforces influencer access — only profiles with is_influencer = 1."""
    if not user.get("is_influencer"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Influencer clearance required for this operation."
        )
    return user


# ─── Models ───────────────────────────────────────────────────────────────────

class CouponValidateRequest(BaseModel):
    code: str


# ─── Endpoints ────────────────────────────────────────────────────────────────

@router.post("/coupon/validate")
async def validate_coupon(
    request: CouponValidateRequest,
    influencer_service: InfluencerService = Depends(get_influencer_service)
):
    """
    Public endpoint. Validates a promo/coupon code and returns discount info.
    Used by the checkout UI before submitting payment.
    """
    res = await influencer_service.validate_coupon(request.code)
    if not res.get("valid"):
        raise HTTPException(status_code=404 if res.get("message") == "Coupon code not found." else 400, detail=res.get("message"))
    return res


@router.get("/coupon")
async def get_my_coupon(
    user: dict = Depends(auth_bearer),
    influencer_service: InfluencerService = Depends(get_influencer_service)
):
    """
    Returns the authenticated influencer's own coupon code.
    Any authenticated user can hit this; returns 404 if they have none.
    """
    coupon = await influencer_service.coupon_repo.get_coupon_by_influencer(user["id"])
    if not coupon:
        raise HTTPException(status_code=404, detail="No coupon code assigned to this account.")
    return coupon


@router.get("/dashboard")
async def get_influencer_dashboard(
    user: dict = Depends(auth_bearer),
    influencer_service: InfluencerService = Depends(get_influencer_service)
):
    """
    Returns all influencer stats for the authenticated user's dashboard.
    Enforced via is_influencer check in the DB (graceful — returns 403 if not influencer).
    """
    res = await influencer_service.get_influencer_dashboard(user["id"])
    if res.get("status") == "error":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=res["message"])
    return res


# ─── Internal helper (maintained for backwards compatibility if imported directly) ───

async def credit_commission(coupon_code: str, user_id: str, original_amount: float, payment_utr: str):
    """
    Delegates to the encapsulated InfluencerService.
    Maintained here to prevent breaking any legacy external imports during transition.
    """
    from app.api.deps import influencer_service
    return await influencer_service.credit_commission(coupon_code, user_id, original_amount, payment_utr)
