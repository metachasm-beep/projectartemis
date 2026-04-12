"""
MATRIARCH Ranking Engine (Sovereign Registry Standard)
======================================================
Consolidated logic for male visibility and protocol standing.
Handles delta shifts (boosting) and absolute state recalculations.
"""
from dataclasses import dataclass
from typing import Dict, List, Optional
import math

@dataclass
class RankTier:
    id: str
    name: str
    min_score: int

# Unified Tier Standard (Matched with MenDashboard.tsx)
MATRIARCH_TIERS = [
    RankTier("aspirant", "The Hopeful", 0),
    RankTier("vanguard", "The Brave", 1000),
    RankTier("noble", "The Gentleman", 2500),
    RankTier("paragon", "The Ideal", 5000),
    RankTier("ascendant", "The Chosen", 10000),
    RankTier("choice", "The One", 25000)
]

class RankingEngine:
    def __init__(self):
        self.tiers = MATRIARCH_TIERS

    def get_tier_by_score(self, score: float) -> RankTier:
        """Returns the tier object based on the numeric score."""
        current_tier = self.tiers[0]
        for tier in self.tiers:
            if score >= tier.min_score:
                current_tier = tier
            else:
                break
        return current_tier

    def calculate_base_score(self, completeness_score: float, is_verified: bool) -> float:
        """
        Recalculates the absolute base score from profile state.
        Points awarded for:
        - Completeness (max 1000 points)
        - Verification (500 points bonus)
        """
        score = completeness_score * 10
        if is_verified:
            score += 500
        return score

    def apply_boost(self, current_score: float, points_spent: int) -> float:
        """
        Calculates the new score after a point-based boost.
        In Matriarch, 1 point spent = 1 score increase for simplicity/transparency.
        """
        return current_score + points_spent

    def get_next_tier_info(self, score: float) -> Optional[Dict]:
        """Calculates distance to next tier for UI feedback."""
        for i, tier in enumerate(self.tiers):
            if score < tier.min_score:
                return {
                    "next_tier_name": tier.name,
                    "points_needed": tier.min_score - score
                }
        return None

# Singleton instance
ranking_engine = RankingEngine()
