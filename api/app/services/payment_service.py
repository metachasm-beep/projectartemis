from typing import Dict, Any, Optional
from app.repositories.base import IPaymentClaimRepository, IProfileRepository
from app.services.influencer_service import InfluencerService
from app.services.sanctuary_service import SanctuaryService
import uuid
import logging

logger = logging.getLogger(__name__)

JUMP_AMOUNTS = {"nudge": 49, "surge": 149, "elite": 499}
JUMP_RANK = {"nudge": 50, "surge": 150, "elite": 500}

class PaymentService:
    def __init__(
        self,
        claim_repo: IPaymentClaimRepository,
        profile_repo: IProfileRepository,
        influencer_service: InfluencerService,
        sanctuary_service: SanctuaryService
    ):
        self.claim_repo = claim_repo
        self.profile_repo = profile_repo
        self.influencer_service = influencer_service
        self.sanctuary_service = sanctuary_service

    async def submit_claim(self, user_id: str, utr: str, jump_type: str, city: str, coupon_code: str = "") -> Dict[str, Any]:
        if len(utr.strip()) < 12:
            return {"status": "error", "message": "Invalid UTR: must be at least 12 characters."}

        if jump_type not in JUMP_AMOUNTS:
            return {"status": "error", "message": f"Invalid tier. Must be one of: {list(JUMP_AMOUNTS.keys())}"}

        existing = await self.claim_repo.get_claim_by_utr(utr)
        if existing:
            return {"status": "error", "message": "This UTR has already been submitted. Please wait for admin review."}

        claim_id = f"claim_{uuid.uuid4().hex[:12]}"
        amount = float(JUMP_AMOUNTS[jump_type])

        success = await self.claim_repo.create_claim(
            claim_id, user_id, utr, jump_type, amount, city, coupon_code
        )
        if not success:
            return {"status": "error", "message": "Failed to store payment claim. Please try again."}

        logger.info(f"📥 CLAIM_RECEIVED: claim_id={claim_id} user={user_id} utr={utr} tier={jump_type}")

        return {
            "status": "pending",
            "claim_id": claim_id,
            "message": "Your payment claim has been received. The Matriarch team will verify and approve within 24 hours.",
            "submitted_utr": utr.strip(),
            "tier": jump_type,
            "amount": amount,
        }

    async def approve_claim(self, utr: str, admin_id: str) -> Dict[str, Any]:
        claim = await self.claim_repo.get_claim_by_utr(utr)
        if not claim:
            return {"status": "error", "message": "Payment claim not found."}

        if claim.get("status") == "approved":
            return {"status": "error", "message": "This claim has already been approved."}

        user_id = claim["user_id"]
        jump_type = claim["jump_type"]
        coupon_code = claim.get("coupon_code", "")

        original_amount = float(claim["amount"])
        paid_amount = original_amount * 0.50 if coupon_code else original_amount

        # Award rank points
        rank_delta = JUMP_RANK.get(jump_type, 150)
        await self.profile_repo.update_rank_score(user_id, rank_delta)
        await self.claim_repo.update_claim_status(utr, "approved")
        await self.profile_repo.update_profile(user_id, {"payment_status": "APPROVED"})

        commission_credited = False
        if coupon_code:
            commission_credited = await self.influencer_service.credit_commission(
                coupon_code, user_id, original_amount, utr
            )

        logger.info(f"✅ CLAIM_APPROVED: UTR={utr} user={user_id} coupon={coupon_code}")

        return {
            "status": "approved",
            "user_id": user_id,
            "utr": utr,
            "paid_amount": paid_amount,
            "coupon_applied": bool(coupon_code),
            "commission_credited": commission_credited,
            "authorized_by": admin_id
        }
