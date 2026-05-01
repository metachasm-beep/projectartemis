from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.security import auth_bearer
from datetime import datetime
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/payments", tags=["Payments"])

JUMP_AMOUNTS = {"nudge": 49, "surge": 149, "elite": 499}


class ClaimRequest(BaseModel):
    user_id: str
    utr: str
    jump_type: str          # 'nudge' | 'surge' | 'elite'
    city: str
    coupon_code: str = ""   # Optional promo code


@router.post("/claim", status_code=202)
async def submit_payment_claim(request: ClaimRequest, user: dict = Depends(auth_bearer)):
    """
    User-facing endpoint: Submit a UTR payment claim for admin review.
    Creates a pending_payment_claims record for the admin to verify and approve.
    Returns 202 Accepted — not yet approved, pending admin action.
    """
    # Validate the authenticated user matches the claim
    if user["id"] != request.user_id:
        raise HTTPException(status_code=403, detail="You can only submit claims for your own account.")

    if len(request.utr.strip()) < 12:
        raise HTTPException(status_code=400, detail="Invalid UTR: must be at least 12 characters.")

    if request.jump_type not in JUMP_AMOUNTS:
        raise HTTPException(status_code=400, detail=f"Invalid tier. Must be one of: {list(JUMP_AMOUNTS.keys())}")

    # Check for duplicate UTR submission
    existing = await turso_client.execute(
        "SELECT id FROM pending_payment_claims WHERE utr = ?",
        [request.utr.strip()]
    )
    if existing.rows:
        raise HTTPException(status_code=409, detail="This UTR has already been submitted. Please wait for admin review.")

    # Store the claim
    claim_id = f"claim_{uuid.uuid4().hex[:12]}"
    amount = JUMP_AMOUNTS[request.jump_type]

    try:
        await turso_client.execute(
            """
            INSERT INTO pending_payment_claims
                (id, user_id, utr, jump_type, amount, city, coupon_code, status, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
            """,
            [claim_id, request.user_id, request.utr.strip(), request.jump_type,
             amount, request.city, request.coupon_code.strip().upper()]
        )
    except Exception as e:
        logger.error(f"❌ CLAIM_STORE_ERROR: {e}")
        raise HTTPException(status_code=500, detail="Failed to store payment claim. Please try again.")

    logger.info(f"📥 CLAIM_RECEIVED: claim_id={claim_id} user={request.user_id} utr={request.utr} tier={request.jump_type}")

    return {
        "status": "pending",
        "claim_id": claim_id,
        "message": "Your payment claim has been received. The Matriarch team will verify and approve within 24 hours.",
        "submitted_utr": request.utr.strip(),
        "tier": request.jump_type,
        "amount": amount,
    }
