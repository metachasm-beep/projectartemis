from fastapi import APIRouter, Depends, HTTPException, status
from app.db.turso import turso_client
from app.core.security import auth_bearer
from pydantic import BaseModel
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/influencer", tags=["Influencer"])

COMMISSION_RATE = 0.10  # 10% of the paid amount
DISCOUNT_PCT = 50       # Fixed 50% discount


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
async def validate_coupon(request: CouponValidateRequest):
    """
    Public endpoint. Validates a promo/coupon code and returns discount info.
    Used by the checkout UI before submitting payment.
    """
    code_upper = request.code.strip().upper()

    res = await turso_client.execute(
        """
        SELECT c.code, c.discount_pct, c.is_active, c.influencer_id,
               p.full_name AS influencer_name
        FROM coupon_codes c
        JOIN profiles p ON p.user_id = c.influencer_id
        WHERE UPPER(c.code) = ?
        """,
        [code_upper]
    )

    if not res.rows:
        raise HTTPException(status_code=404, detail="Coupon code not found.")

    coupon = res.rows[0]

    if not coupon.get("is_active"):
        raise HTTPException(status_code=400, detail="This coupon is no longer active.")

    return {
        "valid": True,
        "code": coupon["code"],
        "discount_pct": coupon["discount_pct"],
        "influencer_name": coupon["influencer_name"],
        "message": f"Code applied! You get {coupon['discount_pct']}% off."
    }


@router.get("/coupon")
async def get_my_coupon(user: dict = Depends(auth_bearer)):
    """
    Returns the authenticated influencer's own coupon code.
    Any authenticated user can hit this; returns 404 if they have none.
    """
    res = await turso_client.execute(
        "SELECT code, discount_pct, is_active FROM coupon_codes WHERE influencer_id = ?",
        [user["id"]]
    )

    if not res.rows:
        raise HTTPException(status_code=404, detail="No coupon code assigned to this account.")

    return res.rows[0]


@router.get("/dashboard")
async def get_influencer_dashboard(user: dict = Depends(auth_bearer)):
    """
    Returns all influencer stats for the authenticated user's dashboard.
    Enforced via is_influencer check in the DB (graceful — returns 403 if not influencer).
    """
    user_id = user["id"]

    # Check influencer status
    profile_res = await turso_client.execute(
        "SELECT is_influencer, pending_balance, full_name FROM profiles WHERE user_id = ?",
        [user_id]
    )
    if not profile_res.rows or not profile_res.rows[0].get("is_influencer"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This dashboard is restricted to Matriarch Influencers."
        )

    profile = profile_res.rows[0]

    # Get coupon code
    coupon_res = await turso_client.execute(
        "SELECT code, discount_pct FROM coupon_codes WHERE influencer_id = ?",
        [user_id]
    )
    coupon = coupon_res.rows[0] if coupon_res.rows else None

    # Aggregate stats from coupon_uses
    stats_res = await turso_client.execute(
        """
        SELECT
            COUNT(*) AS total_referrals,
            COALESCE(SUM(discounted_amount), 0) AS total_sales,
            COALESCE(SUM(commission_earned), 0) AS total_commission
        FROM coupon_uses
        WHERE coupon_code = (
            SELECT code FROM coupon_codes WHERE influencer_id = ? LIMIT 1
        )
        """,
        [user_id]
    )
    stats = stats_res.rows[0] if stats_res.rows else {
        "total_referrals": 0, "total_sales": 0.0, "total_commission": 0.0
    }

    # Recent transactions (last 50)
    tx_res = await turso_client.execute(
        """
        SELECT
            cu.id,
            cu.user_id,
            cu.original_amount,
            cu.discounted_amount,
            cu.commission_earned,
            cu.payment_utr,
            cu.approved_at
        FROM coupon_uses cu
        WHERE cu.coupon_code = (
            SELECT code FROM coupon_codes WHERE influencer_id = ? LIMIT 1
        )
        ORDER BY cu.approved_at DESC
        LIMIT 50
        """,
        [user_id]
    )

    # Redact user IDs for privacy: show only last 6 chars
    transactions = []
    for row in tx_res.rows:
        uid = row.get("user_id", "")
        transactions.append({
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
        "transactions": transactions,
    }


# ─── Internal helper (called by admin coupon approval) ────────────────────────

async def credit_commission(coupon_code: str, user_id: str, original_amount: float, payment_utr: str):
    """
    Called when admin approves a UTR claim that had a coupon code.
    Credits 10% commission to the influencer's pending_balance.
    """
    try:
        coupon_res = await turso_client.execute(
            "SELECT influencer_id FROM coupon_codes WHERE UPPER(code) = ? AND is_active = 1",
            [coupon_code.upper()]
        )
        if not coupon_res.rows:
            logger.warning(f"⚠️ COMMISSION: Coupon {coupon_code} not found or inactive.")
            return False

        influencer_id = coupon_res.rows[0]["influencer_id"]
        discounted_amount = original_amount * 0.50   # 50% discount means user paid half
        commission = round(discounted_amount * COMMISSION_RATE, 2)
        use_id = f"use_{uuid.uuid4().hex[:12]}"

        # Log the coupon use
        await turso_client.execute(
            """
            INSERT INTO coupon_uses
                (id, coupon_code, user_id, original_amount, discounted_amount, commission_earned, payment_utr)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            [use_id, coupon_code.upper(), user_id, original_amount, discounted_amount, commission, payment_utr]
        )

        # Credit the influencer
        await turso_client.execute(
            "UPDATE profiles SET pending_balance = pending_balance + ? WHERE user_id = ?",
            [commission, influencer_id]
        )

        logger.info(f"✅ COMMISSION: ₹{commission} credited to influencer {influencer_id} for coupon {coupon_code}")
        return True

    except Exception as e:
        logger.error(f"❌ COMMISSION_ERROR: {e}")
        return False
