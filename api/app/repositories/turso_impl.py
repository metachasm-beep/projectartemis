from typing import List, Dict, Any, Optional
from app.repositories.base import (
    IProfileRepository,
    ICouponRepository,
    IPaymentClaimRepository,
    IReportRepository,
    ISanctuaryRepository
)
from app.db.turso import turso_client
import logging

logger = logging.getLogger(__name__)

class TursoProfileRepository(IProfileRepository):
    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        res = await turso_client.execute("SELECT * FROM profiles WHERE user_id = ?", [user_id])
        return res.rows[0] if res.rows else None

    async def update_profile(self, user_id: str, data: Dict[str, Any]) -> bool:
        if not data:
            return True
        fields = ", ".join([f"{k} = ?" for k in data.keys()])
        values = list(data.values()) + [user_id]
        await turso_client.execute(f"UPDATE profiles SET {fields}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", values)
        return True

    async def update_rank_score(self, user_id: str, delta: float) -> bool:
        await turso_client.execute("UPDATE profiles SET rank_score = rank_score + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [delta, user_id])
        await turso_client.execute("UPDATE male_rank_profiles SET rank_score = rank_score + ? WHERE user_id = ?", [delta, user_id])
        return True

    async def get_total_men_count(self) -> int:
        res = await turso_client.execute("SELECT COUNT(*) as total FROM profiles WHERE role = 'man'")
        return int(res.rows[0]["total"]) if res.rows else 100

    async def get_all_profiles(self, query: Optional[str] = None) -> List[Dict[str, Any]]:
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

    async def get_men_with_photos(self) -> List[Dict[str, Any]]:
        res = await turso_client.execute("SELECT user_id, photos, created_at FROM profiles WHERE role = 'man'")
        return res.rows

    async def delete_profile(self, user_id: str) -> bool:
        await turso_client.execute("DELETE FROM profiles WHERE user_id = ?", [user_id])
        return True

    async def ban_profile(self, user_id: str) -> bool:
        await turso_client.execute(
            "UPDATE profiles SET onboarding_status = 'BANNED', rank_score = 0, points = 0 WHERE user_id = ?",
            [user_id]
        )
        await turso_client.execute(
            "UPDATE male_rank_profiles SET rank_score = 0 WHERE user_id = ?",
            [user_id]
        )
        return True

    async def recalculate_global_ranks(self) -> bool:
        try:
            await turso_client.execute("""
                WITH ranked AS (
                  SELECT user_id, 
                  ROW_NUMBER() OVER (
                    PARTITION BY role
                    ORDER BY 
                      COALESCE(is_verified, 0) DESC, 
                      COALESCE(rank_score, 0) DESC, 
                      COALESCE(created_at, '9999-12-31') ASC, 
                      user_id ASC
                  ) as new_rank
                  FROM profiles
                )
                UPDATE profiles
                SET absolute_rank = ranked.new_rank
                FROM ranked
                WHERE profiles.user_id = ranked.user_id;
            """)
            return True
        except Exception as e:
            logger.error(f"RANK_REFLOW_FAILURE: {e}")
            return False


class TursoCouponRepository(ICouponRepository):
    async def get_coupon_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        res = await turso_client.execute(
            """
            SELECT c.code, c.discount_pct, c.is_active, c.influencer_id,
                   p.full_name AS influencer_name
            FROM coupon_codes c
            JOIN profiles p ON p.user_id = c.influencer_id
            WHERE UPPER(c.code) = ?
            """,
            [code.upper()]
        )
        return res.rows[0] if res.rows else None

    async def get_coupon_by_influencer(self, influencer_id: str) -> Optional[Dict[str, Any]]:
        res = await turso_client.execute(
            "SELECT code, discount_pct, is_active FROM coupon_codes WHERE influencer_id = ?",
            [influencer_id]
        )
        return res.rows[0] if res.rows else None

    async def create_coupon(self, code: str, influencer_id: str, discount_pct: int, created_by: str) -> bool:
        await turso_client.execute(
            """
            INSERT INTO coupon_codes (code, influencer_id, discount_pct, is_active, created_by)
            VALUES (?, ?, ?, 1, ?)
            """,
            [code.upper(), influencer_id, discount_pct, created_by]
        )
        await turso_client.execute(
            "UPDATE profiles SET is_influencer = 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            [influencer_id]
        )
        return True

    async def update_coupon_status(self, code: str, is_active: bool) -> bool:
        await turso_client.execute(
            "UPDATE coupon_codes SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE code = ?",
            [1 if is_active else 0, code.upper()]
        )
        return True

    async def get_influencers_with_stats(self) -> List[Dict[str, Any]]:
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
        return res.rows

    async def log_coupon_use(self, use_id: str, coupon_code: str, user_id: str, original_amount: float, discounted_amount: float, commission: float, payment_utr: str) -> bool:
        await turso_client.execute(
            """
            INSERT INTO coupon_uses
                (id, coupon_code, user_id, original_amount, discounted_amount, commission_earned, payment_utr)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            [use_id, coupon_code.upper(), user_id, original_amount, discounted_amount, commission, payment_utr]
        )
        coupon_res = await turso_client.execute("SELECT influencer_id FROM coupon_codes WHERE UPPER(code) = ?", [coupon_code.upper()])
        if coupon_res.rows:
            influencer_id = coupon_res.rows[0]["influencer_id"]
            await turso_client.execute(
                "UPDATE profiles SET pending_balance = pending_balance + ? WHERE user_id = ?",
                [commission, influencer_id]
            )
        return True

    async def get_influencer_stats(self, influencer_id: str) -> Dict[str, Any]:
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
            [influencer_id]
        )
        return stats_res.rows[0] if stats_res.rows else {
            "total_referrals": 0, "total_sales": 0.0, "total_commission": 0.0
        }

    async def get_influencer_transactions(self, influencer_id: str, limit: int = 50) -> List[Dict[str, Any]]:
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
            LIMIT ?
            """,
            [influencer_id, limit]
        )
        return tx_res.rows


class TursoPaymentClaimRepository(IPaymentClaimRepository):
    async def get_claim_by_utr(self, utr: str) -> Optional[Dict[str, Any]]:
        res = await turso_client.execute("SELECT * FROM pending_payment_claims WHERE utr = ?", [utr.strip()])
        return res.rows[0] if res.rows else None

    async def create_claim(self, claim_id: str, user_id: str, utr: str, jump_type: str, amount: float, city: str, coupon_code: str) -> bool:
        await turso_client.execute(
            """
            INSERT INTO pending_payment_claims
                (id, user_id, utr, jump_type, amount, city, coupon_code, status, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
            """,
            [claim_id, user_id, utr.strip(), jump_type, amount, city, coupon_code.strip().upper()]
        )
        return True

    async def update_claim_status(self, utr: str, status: str) -> bool:
        await turso_client.execute("UPDATE pending_payment_claims SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE utr = ?", [status, utr.strip()])
        return True


class TursoReportRepository(IReportRepository):
    async def create_report(self, report_id: str, reporter_id: str, reported_id: str, reason: str, status: str = "resolved") -> bool:
        await turso_client.execute(
            "INSERT INTO reports (id, reporter_id, reported_id, reason, status) VALUES (?, ?, ?, ?, ?)",
            [report_id, reporter_id, reported_id, reason, status]
        )
        return True


class TursoSanctuaryRepository(ISanctuaryRepository):
    async def log_rank_reward(self, log_id: str, user_id: str, delta: float, reason: str) -> bool:
        await turso_client.batch([
            ("INSERT INTO rank_logs (id, user_id, delta, reason) VALUES (?, ?, ?, ?)", [log_id, user_id, delta, reason]),
            ("UPDATE profiles SET rank_score = rank_score + ? WHERE user_id = ?", [delta, user_id])
        ])
        return True

    async def get_rank_history(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        res = await turso_client.execute("SELECT * FROM rank_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ?", [user_id, limit])
        return res.rows

    async def track_signal(self, signal_id: str, man_id: str, woman_id: Optional[str], metric_type: str) -> bool:
        await turso_client.execute(
            "INSERT INTO profile_analytics (id, man_user_id, woman_user_id, metric_type) VALUES (?, ?, ?, ?)",
            [signal_id, man_id, woman_id or None, metric_type]
        )
        return True

    async def get_signal_metrics(self, user_id: str) -> Dict[str, int]:
        res = await turso_client.execute("""
            SELECT metric_type, COUNT(*) as count
            FROM profile_analytics 
            WHERE man_user_id = ? AND created_at >= date('now', '-30 days')
            GROUP BY metric_type
        """, [user_id])
        metrics = {"impression": 0, "visit": 0, "save": 0}
        for row in res.rows:
            metrics[row["metric_type"]] = int(row["count"])
        return metrics
