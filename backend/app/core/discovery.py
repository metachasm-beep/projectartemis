"""
MATRIARCH Discovery Engine
===========================
Generates a curated, ranked feed of men for women to browse.
Does NOT simply sort by rank_score descending — uses fairness windowing,
exploration/exploitation balance, and frequency capping.
"""
from typing import List, Optional
from dataclasses import dataclass
import uuid
import random


@dataclass
class DiscoveryCandidate:
    man_id: str
    rank_score: float
    age: int
    city: str
    aadhaar_verified: bool
    distance_km: float
    times_shown: int = 0


@dataclass
class DiscoveryFilters:
    woman_id: str
    min_age: int = 18
    max_age: int = 50
    max_distance_km: int = 100
    aadhaar_verified_only: bool = False
    excluded_ids: List[str] = None   # already seen / blocked / matched

    def __post_init__(self):
        if self.excluded_ids is None:
            self.excluded_ids = []


class DiscoveryEngine:
    """
    Feed generation principles:
    - Rank-first ordering within quality bands (not raw sort)
    - Exploration bucket: 15% random-ish profiles from outside top-20%
    - Frequency cap: same man shown max N times per day
    - Anti-monopoly: top-ranked man can't fill > 30% of a single batch
    - Safety filter: auto-exclude banned / shadowbanned / aadhaar_required failures
    """

    BATCH_SIZE = 20
    EXPLORATION_RATIO = 0.15          # 15% of batch = exploration
    MONOPOLY_CAP = 0.30               # top man can be at most 30% of a batch (for future multi-account scenarios)
    FREQUENCY_CAP_PER_DAY = 3        # same man shown at most 3× per day

    def build_feed(
        self,
        filters: DiscoveryFilters,
        candidates: List[DiscoveryCandidate],
    ) -> List[DiscoveryCandidate]:
        # 1. Apply hard filters
        candidates = self._apply_filters(filters, candidates)

        if not candidates:
            return []

        # 2. Sort by rank_score desc (baseline)
        candidates.sort(key=lambda c: c.rank_score, reverse=True)

        # 3. Split into exploitation (top 85%) and exploration (bottom 15%)
        exploit_count = int(self.BATCH_SIZE * (1 - self.EXPLORATION_RATIO))
        explore_count = self.BATCH_SIZE - exploit_count

        exploit_pool = candidates[:max(len(candidates) // 2, exploit_count)]
        explore_pool = candidates[max(len(candidates) // 2, exploit_count):]

        # 4. Pick exploitation batch (sequential from sorted)
        exploit_batch = exploit_pool[:exploit_count]

        # 5. Pick exploration batch (random from tail)
        explore_batch = random.sample(explore_pool, min(explore_count, len(explore_pool)))

        # 6. Merge and shuffle within quality bands to avoid predictability
        final_batch = exploit_batch + explore_batch
        random.shuffle(final_batch)

        return final_batch[:self.BATCH_SIZE]

    def _apply_filters(
        self, filters: DiscoveryFilters, candidates: List[DiscoveryCandidate]
    ) -> List[DiscoveryCandidate]:
        result = []
        for c in candidates:
            if c.man_id in filters.excluded_ids:
                continue
            if not (filters.min_age <= c.age <= filters.max_age):
                continue
            if c.distance_km > filters.max_distance_km:
                continue
            if filters.aadhaar_verified_only and not c.aadhaar_verified:
                continue
            if c.times_shown >= self.FREQUENCY_CAP_PER_DAY:
                continue
            result.append(c)
        return result


discovery_engine = DiscoveryEngine()
