from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class IProfileRepository(ABC):
    @abstractmethod
    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def update_profile(self, user_id: str, data: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    async def update_rank_score(self, user_id: str, delta: float) -> bool:
        pass

    @abstractmethod
    async def get_total_men_count(self) -> int:
        pass

    @abstractmethod
    async def get_all_profiles(self, query: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def get_men_with_photos(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def delete_profile(self, user_id: str) -> bool:
        pass

    @abstractmethod
    async def ban_profile(self, user_id: str) -> bool:
        pass

    @abstractmethod
    async def recalculate_global_ranks(self) -> bool:
        pass


class ICouponRepository(ABC):
    @abstractmethod
    async def get_coupon_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def get_coupon_by_influencer(self, influencer_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def create_coupon(self, code: str, influencer_id: str, discount_pct: int, created_by: str) -> bool:
        pass

    @abstractmethod
    async def update_coupon_status(self, code: str, is_active: bool) -> bool:
        pass

    @abstractmethod
    async def get_influencers_with_stats(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def log_coupon_use(self, use_id: str, coupon_code: str, user_id: str, original_amount: float, discounted_amount: float, commission: float, payment_utr: str) -> bool:
        pass

    @abstractmethod
    async def get_influencer_stats(self, influencer_id: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def get_influencer_transactions(self, influencer_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        pass


class IPaymentClaimRepository(ABC):
    @abstractmethod
    async def get_claim_by_utr(self, utr: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def create_claim(self, claim_id: str, user_id: str, utr: str, jump_type: str, amount: float, city: str, coupon_code: str) -> bool:
        pass

    @abstractmethod
    async def update_claim_status(self, utr: str, status: str) -> bool:
        pass


class IReportRepository(ABC):
    @abstractmethod
    async def create_report(self, report_id: str, reporter_id: str, reported_id: str, reason: str, status: str = "resolved") -> bool:
        pass


class ISanctuaryRepository(ABC):
    @abstractmethod
    async def log_rank_reward(self, log_id: str, user_id: str, delta: float, reason: str) -> bool:
        pass

    @abstractmethod
    async def get_rank_history(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def track_signal(self, signal_id: str, man_id: str, woman_id: Optional[str], metric_type: str) -> bool:
        pass

    @abstractmethod
    async def get_signal_metrics(self, user_id: str) -> Dict[str, int]:
        pass
