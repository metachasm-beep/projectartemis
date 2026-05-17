from typing import Dict, Any, List, Optional
from app.repositories.base import (
    IProfileRepository,
    ISanctuaryRepository,
    IReportRepository
)
import uuid
import logging

logger = logging.getLogger(__name__)

class SanctuaryService:
    def __init__(
        self,
        profile_repo: IProfileRepository,
        sanctuary_repo: ISanctuaryRepository,
        report_repo: IReportRepository
    ):
        self.profile_repo = profile_repo
        self.sanctuary_repo = sanctuary_repo
        self.report_repo = report_repo

    async def reward_rank(self, user_id: str, delta: float, reason: str) -> bool:
        """High-Integrity Rank Reward Ledger Protocol."""
        log_id = f"rank_log_{uuid.uuid4().hex[:12]}"
        success = await self.sanctuary_repo.log_rank_reward(log_id, user_id, delta, reason)
        if success:
            await self.profile_repo.recalculate_global_ranks()
        return success

    async def purchase_jump(self, user_id: str, jump_percent: int) -> int:
        """AURA Tokenomics: Percentile Leap Protocol."""
        total_men = await self.profile_repo.get_total_men_count()
        jump_points = int((jump_percent / 100.0) * total_men * 10)
        await self.reward_rank(user_id, jump_points, f"Aura Jump Executed: {jump_percent}% Population Leap")
        return jump_points

    async def purchase_seal_of_excellence(self, user_id: str) -> bool:
        """The ultimate seal: 1,000,000 point boost to secure Rank #1 position."""
        return await self.reward_rank(user_id, 1000000, "Seal of Excellence Acquired")

    async def sync_integrity_bonus(self, user_id: str, integrity_score: int) -> int:
        """Dossier Resonance Sync: Rewards rank_score based on profile integrity."""
        bonus = int(integrity_score / 10) * 500
        await self.reward_rank(user_id, bonus, f"Dossier Calibration Bonus: {integrity_score}% Integrity")
        return bonus

    async def recalculate_global_ranks(self) -> bool:
        """Sovereign Atomic Reflow: Re-indexes the entire sanctuary hierarchy."""
        return await self.profile_repo.recalculate_global_ranks()

    async def track_signal(self, man_id: str, metric_type: str, woman_id: Optional[str] = None) -> bool:
        """Sanctuary Signals: The Feedback Loop."""
        signal_id = f"sig_{uuid.uuid4().hex[:12]}"
        return await self.sanctuary_repo.track_signal(signal_id, man_id, woman_id, metric_type)

    async def get_signal_metrics(self, user_id: str) -> Dict[str, int]:
        return await self.sanctuary_repo.get_signal_metrics(user_id)

    async def report_user(self, reporter_id: str, reported_id: str, reason: str) -> bool:
        """Sovereign Protection: Report and Council Auditing."""
        report_id = f"rep_{uuid.uuid4().hex[:12]}"
        return await self.report_repo.create_report(report_id, reporter_id, reported_id, reason, "pending")

    def get_tier_from_rank(self, rank: int, total: int) -> Dict[str, str]:
        """Tier Brackets (Absolute Population Based)."""
        if rank <= 10:
            return {"id": "choice", "name": "The Choice", "color": "mat-gold-foil"}
        
        percentile = (rank / float(total)) * 100.0
        
        if percentile <= 5:
            return {"id": "ascendant", "name": "Ascendant", "color": "mat-gold"}
        if percentile <= 15:
            return {"id": "paragon", "name": "Paragon", "color": "mat-wine-soft"}
        if percentile <= 30:
            return {"id": "noble", "name": "Noble", "color": "mat-wine"}
        if percentile <= 60:
            return {"id": "vanguard", "name": "Vanguard", "color": "mat-rose"}
        return {"id": "aspirant", "name": "Aspirant", "color": "mat-slate"}
