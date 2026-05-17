from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import auth_bearer
from app.api.deps import get_payment_service, PaymentService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payments", tags=["Payments"])

class ClaimRequest(BaseModel):
    user_id: str
    utr: str
    jump_type: str          # 'nudge' | 'surge' | 'elite'
    city: str
    coupon_code: str = ""   # Optional promo code


@router.post("/claim", status_code=202)
async def submit_payment_claim(
    request: ClaimRequest, 
    user: dict = Depends(auth_bearer),
    payment_service: PaymentService = Depends(get_payment_service)
):
    """
    User-facing endpoint: Submit a UTR payment claim for admin review.
    Creates a pending_payment_claims record for the admin to verify and approve.
    Returns 202 Accepted — not yet approved, pending admin action.
    """
    if user["id"] != request.user_id:
        raise HTTPException(status_code=403, detail="You can only submit claims for your own account.")

    res = await payment_service.submit_claim(
        request.user_id, request.utr, request.jump_type, request.city, request.coupon_code
    )
    if res.get("status") == "error":
        raise HTTPException(
            status_code=409 if res.get("message") == "This UTR has already been submitted. Please wait for admin review." else 400,
            detail=res["message"]
        )

    return res
