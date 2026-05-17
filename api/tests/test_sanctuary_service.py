import pytest
from typing import Dict, Any, List, Optional
from app.repositories.base import IProfileRepository, ISanctuaryRepository, IReportRepository
from app.services.sanctuary_service import SanctuaryService

class MockProfileRepository(IProfileRepository):
    def __init__(self):
        self.profiles = {
            "usr_1": {"user_id": "usr_1", "rank_score": 100, "is_verified": 1, "role": "man"},
            "usr_2": {"user_id": "usr_2", "rank_score": 50, "is_verified": 0, "role": "man"},
        }
        self.reflow_called = False

    async def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self.profiles.get(user_id)

    async def update_profile(self, user_id: str, data: Dict[str, Any]) -> bool:
        if user_id in self.profiles:
            self.profiles[user_id].update(data)
            return True
        return False

    async def update_rank_score(self, user_id: str, delta: float) -> bool:
        if user_id in self.profiles:
            self.profiles[user_id]["rank_score"] += delta
            return True
        return False

    async def get_total_men_count(self) -> int:
        return len([p for p in self.profiles.values() if p.get("role") == "man"])

    async def get_all_profiles(self, query: Optional[str] = None) -> List[Dict[str, Any]]:
        return list(self.profiles.values())

    async def get_men_with_photos(self) -> List[Dict[str, Any]]:
        return list(self.profiles.values())

    async def delete_profile(self, user_id: str) -> bool:
        if user_id in self.profiles:
            del self.profiles[user_id]
            return True
        return False

    async def ban_profile(self, user_id: str) -> bool:
        if user_id in self.profiles:
            self.profiles[user_id]["rank_score"] = 0
            return True
        return False

    async def recalculate_global_ranks(self) -> bool:
        self.reflow_called = True
        return True


class MockSanctuaryRepository(ISanctuaryRepository):
    def __init__(self):
        self.rank_logs = []
        self.signals = []

    async def log_rank_reward(self, log_id: str, user_id: str, delta: float, reason: str) -> bool:
        self.rank_logs.append({"id": log_id, "user_id": user_id, "delta": delta, "reason": reason})
        return True

    async def get_rank_history(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        return [log for log in self.rank_logs if log["user_id"] == user_id][:limit]

    async def track_signal(self, signal_id: str, man_id: str, woman_id: Optional[str], metric_type: str) -> bool:
        self.signals.append({"id": signal_id, "man_id": man_id, "woman_id": woman_id, "metric_type": metric_type})
        return True

    async def get_signal_metrics(self, user_id: str) -> Dict[str, int]:
        impressions = len([s for s in self.signals if s["man_id"] == user_id and s["metric_type"] == "impression"])
        return {"impression": impressions, "visit": 0, "save": 0}


class MockReportRepository(IReportRepository):
    def __init__(self):
        self.reports = []

    async def create_report(self, report_id: str, reporter_id: str, reported_id: str, reason: str, status: str = "resolved") -> bool:
        self.reports.append({"id": report_id, "reporter_id": reporter_id, "reported_id": reported_id, "reason": reason, "status": status})
        return True


@pytest.fixture
def sanctuary_service():
    profile_repo = MockProfileRepository()
    sanctuary_repo = MockSanctuaryRepository()
    report_repo = MockReportRepository()
    return SanctuaryService(profile_repo, sanctuary_repo, report_repo)


@pytest.mark.asyncio
async def test_reward_rank(sanctuary_service):
    success = await sanctuary_service.reward_rank("usr_1", 500, "Milestone Reward")
    assert success is True
    assert sanctuary_service.profile_repo.reflow_called is True
    assert len(sanctuary_service.sanctuary_repo.rank_logs) == 1
    assert sanctuary_service.sanctuary_repo.rank_logs[0]["delta"] == 500


@pytest.mark.asyncio
async def test_purchase_jump(sanctuary_service):
    # Total men = 2. Jump 50% = (50/100) * 2 * 10 = 10 points.
    points = await sanctuary_service.purchase_jump("usr_1", 50)
    assert points == 10
    assert sanctuary_service.profile_repo.reflow_called is True
    assert len(sanctuary_service.sanctuary_repo.rank_logs) == 1
    assert "50% Population Leap" in sanctuary_service.sanctuary_repo.rank_logs[0]["reason"]


@pytest.mark.asyncio
async def test_purchase_seal_of_excellence(sanctuary_service):
    success = await sanctuary_service.purchase_seal_of_excellence("usr_1")
    assert success is True
    assert sanctuary_service.sanctuary_repo.rank_logs[0]["delta"] == 1000000


@pytest.mark.asyncio
async def test_sync_integrity_bonus(sanctuary_service):
    bonus = await sanctuary_service.sync_integrity_bonus("usr_1", 85)
    assert bonus == 4000  # (85/10) = 8 * 500 = 4000
    assert sanctuary_service.sanctuary_repo.rank_logs[0]["delta"] == 4000


@pytest.mark.asyncio
async def test_track_signal(sanctuary_service):
    success = await sanctuary_service.track_signal("usr_1", "impression", "woman_1")
    assert success is True
    assert len(sanctuary_service.sanctuary_repo.signals) == 1
    assert sanctuary_service.sanctuary_repo.signals[0]["metric_type"] == "impression"


def test_get_tier_from_rank(sanctuary_service):
    tier = sanctuary_service.get_tier_from_rank(1, 100)
    assert tier["id"] == "choice"
    assert tier["name"] == "The Choice"

    tier = sanctuary_service.get_tier_from_rank(12, 100) # 12%
    assert tier["id"] == "paragon"
    assert tier["name"] == "Paragon"
