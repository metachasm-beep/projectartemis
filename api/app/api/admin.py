from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.security import auth_bearer
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
async def get_all_profiles(admin: dict = Depends(require_admin), query: str = ""):
    """Full Registry Auditing view for Matriarch Stewards. Supports optional ?query= filter by name."""
    if query and len(query) >= 2:
        res = await turso_client.execute(
            "SELECT user_id, full_name, city, role, created_at FROM profiles WHERE full_name LIKE ? ORDER BY full_name ASC LIMIT 20",
            [f"%{query}%"]
        )
    else:
        res = await turso_client.execute(
            "SELECT user_id, full_name, photos, role, created_at FROM profiles ORDER BY created_at DESC"
        )
    return res.rows

@router.delete("/user/{user_id}")
async def hard_delete_user(user_id: str, admin: dict = Depends(require_admin)):
    """Permanent eviction logic for 'The Protocol' v2.4."""
    await turso_client.execute("DELETE FROM profiles WHERE user_id = ?", [user_id])
    return {"status": "evicted", "user_id": user_id, "auditor": admin["id"]}


# ─── INFLUENCER MANAGEMENT ────────────────────────────────────────────────────

class CreateCouponRequest(BaseModel):
    influencer_user_id: str
    code: str            # e.g. 'SAKSHAM50'
    discount_pct: int = 50

class ApproveClaimRequest(BaseModel):
    user_id: str
    utr: str
    jump_type: str       # 'nudge' | 'surge' | 'elite'
    city: str
    coupon_code: str = ""   # Optional: filled if user applied a promo code

JUMP_AMOUNTS = {"nudge": 49, "surge": 149, "elite": 499}


@router.post("/influencer/create-coupon")
async def create_influencer_coupon(request: CreateCouponRequest, admin: dict = Depends(require_admin)):
    """
    Admin: Create a unique promo coupon for an influencer.
    Also marks the target profile as is_influencer = 1.
    """
    code_upper = request.code.strip().upper()

    # Check influencer profile exists
    profile_res = await turso_client.execute(
        "SELECT user_id, full_name FROM profiles WHERE user_id = ?",
        [request.influencer_user_id]
    )
    if not profile_res.rows:
        raise HTTPException(status_code=404, detail="Influencer profile not found.")

    # Check code uniqueness
    existing = await turso_client.execute(
        "SELECT code FROM coupon_codes WHERE UPPER(code) = ?",
        [code_upper]
    )
    if existing.rows:
        raise HTTPException(status_code=409, detail=f"Coupon code '{code_upper}' already exists.")

    # Create the coupon
    await turso_client.execute(
        """
        INSERT INTO coupon_codes (code, influencer_id, discount_pct, is_active, created_by)
        VALUES (?, ?, ?, 1, ?)
        """,
        [code_upper, request.influencer_user_id, request.discount_pct, admin["id"]]
    )

    # Mark profile as influencer
    await turso_client.execute(
        "UPDATE profiles SET is_influencer = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        [request.influencer_user_id]
    )

    logger.info(f"🎟️ COUPON_CREATED: {code_upper} for influencer {request.influencer_user_id} by admin {admin['id']}")

    return {
        "status": "created",
        "code": code_upper,
        "influencer_id": request.influencer_user_id,
        "influencer_name": profile_res.rows[0]["full_name"],
        "discount_pct": request.discount_pct,
        "authorized_by": admin["id"]
    }


@router.get("/influencer/list")
async def list_influencers(admin: dict = Depends(require_admin)):
    """
    Admin: List all influencers with their coupon codes and earnings stats.
    """
    res = await turso_client.execute(
        """
        SELECT
            p.user_id,
            p.full_name,
            p.city,
            p.pending_balance,
            c.code AS coupon_code,
            c.discount_pct,
            c.is_active,
            c.created_at AS coupon_created_at,
            COALESCE(stats.total_referrals, 0) AS total_referrals,
            COALESCE(stats.total_sales, 0) AS total_sales,
            COALESCE(stats.total_commission, 0) AS total_commission
        FROM profiles p
        LEFT JOIN coupon_codes c ON c.influencer_id = p.user_id
        LEFT JOIN (
            SELECT
                coupon_code,
                COUNT(*) AS total_referrals,
                SUM(discounted_amount) AS total_sales,
                SUM(commission_earned) AS total_commission
            FROM coupon_uses
            GROUP BY coupon_code
        ) stats ON stats.coupon_code = c.code
        WHERE p.is_influencer = 1
        ORDER BY p.created_at DESC
        """
    )
    return {"influencers": res.rows}


@router.post("/influencer/toggle-coupon")
async def toggle_coupon_status(request: dict, admin: dict = Depends(require_admin)):
    """Admin: Activate or deactivate a coupon code."""
    code = request.get("code", "").upper()
    is_active = request.get("is_active", True)
    await turso_client.execute(
        "UPDATE coupon_codes SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?",
        [1 if is_active else 0, code]
    )
    return {"code": code, "is_active": is_active}


@router.post("/payments/approve-claim")
async def approve_payment_claim(request: ApproveClaimRequest, admin: dict = Depends(require_admin)):
    """
    Admin: Approve a pending UTR payment claim.
    If a coupon_code is present, fires the 10% influencer commission.
    """
    original_amount = float(JUMP_AMOUNTS.get(request.jump_type, 149))
    paid_amount = original_amount * 0.50 if request.coupon_code else original_amount

    # Award rank points (mirroring the existing payments logic)
    JUMP_RANK = {"nudge": 50, "surge": 150, "elite": 500}
    rank_delta = JUMP_RANK.get(request.jump_type, 150)
    await turso_client.execute(
        "UPDATE male_rank_profiles SET rank_score = rank_score + ? WHERE user_id = ?",
        [rank_delta, request.user_id]
    )
    await turso_client.execute(
        "UPDATE profiles SET payment_status = 'APPROVED', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        [request.user_id]
    )

    commission_credited = False
    if request.coupon_code:
        from app.api.influencer import credit_commission
        commission_credited = await credit_commission(
            coupon_code=request.coupon_code,
            user_id=request.user_id,
            original_amount=original_amount,
            payment_utr=request.utr
        )

    logger.info(f"✅ CLAIM_APPROVED: UTR={request.utr} user={request.user_id} coupon={request.coupon_code}")

    return {
        "status": "approved",
        "user_id": request.user_id,
        "utr": request.utr,
        "paid_amount": paid_amount,
        "coupon_applied": bool(request.coupon_code),
        "commission_credited": commission_credited,
        "authorized_by": admin["id"]
    }

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
