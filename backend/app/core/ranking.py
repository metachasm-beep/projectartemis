"""
MATRIARCH Ranking Engine
========================
Configurable weighted formula for male visibility ranking.
Anti-fraud caps and decay functions are built in.
"""
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Optional


@dataclass
class RankWeights:
    """Admin-configurable weights. Stored in DB, loaded at runtime."""
    profile_completeness: float = 0.25
    verification_bonus: float = 0.20
    referral_bonus: float = 0.15
    ad_watch_bonus: float = 0.10
    paid_boost_bonus: float = 0.20
    engagement_bonus: float = 0.10

    # Penalty weights
    moderation_penalty_per_report: float = 10.0
    spam_penalty_per_flag: float = 8.0
    inactivity_penalty_per_day: float = 0.5

    # Anti-abuse caps
    max_ad_credits_per_day: int = 10
    max_referral_bonus: float = 50.0
    max_boost_bonus: float = 40.0


@dataclass
class RankInput:
    user_id: str
    profile_completeness: float          # 0.0 - 1.0
    is_aadhaar_verified: bool
    referral_count: int
    ad_watch_credits: float
    paid_boost_level: float              # 0 = none, higher = more paid
    engagement_score: float              # derived from response quality etc.
    report_count: int
    flagged_message_count: int
    fraud_signals: int
    last_active: Optional[datetime] = None
    boost_active_until: Optional[datetime] = None


class RankingEngine:
    def __init__(self, weights: Optional[RankWeights] = None):
        self.w = weights or RankWeights()

    def calculate(self, inp: RankInput) -> float:
        now = datetime.utcnow()

        # --- Base score from profile completeness ---
        base = inp.profile_completeness * 100 * self.w.profile_completeness

        # --- Verification bonus ---
        ver_bonus = 20.0 if inp.is_aadhaar_verified else 0.0
        ver_bonus *= self.w.verification_bonus / 0.20  # normalise

        # --- Referral bonus (capped) ---
        ref_bonus = min(inp.referral_count * 5.0, self.w.max_referral_bonus)
        ref_bonus *= self.w.referral_bonus / 0.15

        # --- Ad watch bonus (capped by daily limit) ---
        ad_bonus = min(inp.ad_watch_credits * 2.0, self.w.max_ad_credits_per_day * 2.0)
        ad_bonus *= self.w.ad_watch_bonus / 0.10

        # --- Paid boost bonus (capped) ---
        boost_bonus = 0.0
        if inp.boost_active_until and inp.boost_active_until > now:
            boost_bonus = min(inp.paid_boost_level * 10.0, self.w.max_boost_bonus)
            boost_bonus *= self.w.paid_boost_bonus / 0.20

        # --- Engagement bonus ---
        eng_bonus = inp.engagement_score * 10.0 * self.w.engagement_bonus / 0.10

        # --- Inactivity penalty ---
        inactivity_penalty = 0.0
        if inp.last_active:
            days_inactive = max(0, (now - inp.last_active).days - 3)
            inactivity_penalty = days_inactive * self.w.inactivity_penalty_per_day

        # --- Moderation penalties ---
        mod_penalty = (
            inp.report_count * self.w.moderation_penalty_per_report
            + inp.flagged_message_count * self.w.spam_penalty_per_flag
            + inp.fraud_signals * 15.0
        )

        raw_score = (
            base + ver_bonus + ref_bonus + ad_bonus + boost_bonus + eng_bonus
            - inactivity_penalty - mod_penalty
        )

        # Floor at zero — never negative visibility
        return max(0.0, round(raw_score, 2))


# Singleton with default weights; admin can override
ranking_engine = RankingEngine()
