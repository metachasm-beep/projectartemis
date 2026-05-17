from typing import Dict, Any, List, Optional
from app.repositories.base import ICouponRepository, IProfileRepository
import uuid
import logging

logger = logging.getLogger(__name__)

COMMISSION_RATE = 0.10  # 10% of the paid amount
DISCOUNT_PCT = 50       # Fixed 50% discount

class InfluencerService:
    def __init__(self, coupon_repo: ICouponRepository, profile_repo: IProfileRepository):
        self.coupon_repo = coupon_repo
        self.profile_repo = profile_repo

    async def validate_coupon(self, code: str) -> Dict[str, Any]:
        coupon = await self.coupon_repo.get_coupon_by_code(code)
        if not coupon:
            return {"valid": False, "message": "Coupon code not found."}
        if not coupon.get("is_active"):
            return {"valid": False, "message": "This coupon is no longer active."}

        return {
            "valid": True,
            "code": coupon["code"],
            "discount_pct": coupon["discount_pct"],
            "influencer_name": coupon["influencer_name"],
            "message": f"Code applied! You get {coupon['discount_pct']}% off."
        }

    async def create_coupon(self, code: str, influencer_id: str, discount_pct: int, admin_id: str) -> Dict[str, Any]:
        profile = await self.profile_repo.get_profile(influencer_id)
        if not profile:
            return {"status": "error", "message": "Influencer profile not found."}

        existing = await self.coupon_repo.get_coupon_by_code(code)
        if existing:
            return {"status": "error", "message": f"Coupon code '{code.upper()}' already exists."}

        success = await self.coupon_repo.create_coupon(code, influencer_id, discount_pct, admin_id)
        if not success:
            return {"status": "error", "message": "Failed to create coupon."}

        logger.info(f"🎟️ COUPON_CREATED: {code.upper()} for influencer {influencer_id} by admin {admin_id}")

        return {
            "status": "created",
            "code": code.upper(),
            "influencer_id": influencer_id,
            "influencer_name": profile["full_name"],
            "discount_pct": discount_pct,
            "authorized_by": admin_id
        }

    async def get_influencer_dashboard(self, user_id: str) -> Dict[str, Any]:
        profile = await self.profile_repo.get_profile(user_id)
        if not profile or not profile.get("is_influencer"):
            return {"status": "error", "message": "This dashboard is restricted to Matriarch Influencers."}

        coupon = await self.coupon_repo.get_coupon_by_influencer(user_id)
        stats = await self.coupon_repo.get_influencer_stats(user_id)
        transactions = await self.coupon_repo.get_influencer_transactions(user_id, limit=50)

        formatted_tx = []
        for row in transactions:
            uid = row.get("user_id", "")
            formatted_tx.append({
                "id": row["id"],
                "redacted_user": f"USR_****{uid[-4:].upper()}" if uid else "USR_UNKNOWN",
                "original_amount": row["original_amount"],
                "discounted_amount": row["discounted_amount"],
                "commission_earned": row["commission_earned"],
                "approved_at": row["approved_at"],
            })

        return {
            "influencer_name": profile["full_name"],
            "coupon": coupon,
            "pending_balance": profile.get("pending_balance", 0.0),
            "stats": {
                "total_referrals": int(stats["total_referrals"]) if stats["total_referrals"] else 0,
                "total_sales": round(float(stats["total_sales"]) if stats["total_sales"] else 0.0, 2),
                "total_commission": round(float(stats["total_commission"]) if stats["total_commission"] else 0.0, 2),
            },
            "transactions": formatted_tx,
        }

    async def credit_commission(self, coupon_code: str, user_id: str, original_amount: float, payment_utr: str) -> bool:
        coupon = await self.coupon_repo.get_coupon_by_code(coupon_code)
        if not coupon or not coupon.get("is_active"):
            logger.warning(f"⚠️ COMMISSION: Coupon {coupon_code} not found or inactive.")
            return False

        discounted_amount = original_amount * 0.50
        commission = round(discounted_amount * COMMISSION_RATE, 2)
        use_id = f"use_{uuid.uuid4().hex[:12]}"

        success = await self.coupon_repo.log_coupon_use(
            use_id, coupon_code, user_id, original_amount, discounted_amount, commission, payment_utr
        )
        if success:
            logger.info(f"✅ COMMISSION: ₹{commission} credited to influencer {coupon['influencer_id']} for coupon {coupon_code}")
        return success
