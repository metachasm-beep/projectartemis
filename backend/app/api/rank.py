from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.core.ranking import ranking_engine
from app.db.turso import turso_client
from datetime import datetime
import json

router = APIRouter()

class RankStatusResponse(BaseModel):
    user_id: str
    rank_score: float
    rank_tier: str
    rank_tier_name: str
    profile_completeness_pct: int
    is_aadhaar_verified: bool
    points_to_next_tier: Optional[int] = None
    next_tier_name: Optional[str] = None
    tips: List[str]

class BoostRequest(BaseModel):
    user_id: str
    points_to_spend: int = 100

@router.get("/{user_id}/status", response_model=RankStatusResponse)
async def get_rank_status(user_id: str):
    """
    Returns a user's current status from the Turso Registry.
    """
    # 1. Fetch Profile from Turso
    res = await turso_client.execute("SELECT * FROM profiles WHERE user_id = ?", [user_id])
    if not res:
        raise HTTPException(status_code=404, detail="Matriarch user not found.")
    
    profile = res[0]
    score = profile.get("rank_score", 0.0)
    
    # 2. Get Tier Info from Engine (Single Source of Truth)
    tier = ranking_engine.get_tier_by_score(score)
    next_info = ranking_engine.get_next_tier_info(score)
    
    # 3. Dynamic Tips
    tips = []
    if not profile.get("aadhaar_verified"):
        tips.append("Verify your identity with Aadhaar to gain 500 status points.")
    if profile.get("profile_completeness", 0) < 80:
        tips.append("Complete your dossier details to improve your standing.")

    return RankStatusResponse(
        user_id=user_id,
        rank_score=score,
        rank_tier=tier.id,
        rank_tier_name=tier.name,
        profile_completeness_pct=int(profile.get("profile_completeness", 0)),
        is_aadhaar_verified=bool(profile.get("aadhaar_verified")),
        points_to_next_tier=next_info["points_needed"] if next_info else None,
        next_tier_name=next_info["next_tier_name"] if next_info else None,
        tips=tips
    )

@router.post("/boost")
async def apply_rank_boost(req: BoostRequest):
    """
    Spends tokens/points to augment a user's ranking score.
    Uses the RankingEngine to calculate the delta shift.
    """
    # 1. Fetch current score
    res = await turso_client.execute("SELECT rank_score, tokens FROM profiles WHERE user_id = ?", [req.user_id])
    if not res:
        raise HTTPException(status_code=404, detail="User not found.")
    
    current_score = res[0].get("rank_score", 0.0)
    current_tokens = res[0].get("tokens", 0)

    if current_tokens < req.points_to_spend:
        raise HTTPException(status_code=400, detail="Insufficient tokens for status augmentation.")

    # 2. Calculate New Score via Engine
    new_score = ranking_engine.apply_boost(current_score, req.points_to_spend)
    new_tokens = current_tokens - req.points_to_spend

    # 3. Atomic Update in Turso
    try:
        await turso_client.execute(
            "UPDATE profiles SET rank_score = ?, tokens = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            [new_score, new_tokens, req.user_id]
        )
        # Also log transaction
        await turso_client.execute(
            "INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES (?, ?, ?, ?, ?)",
            [f"boost_{int(datetime.now().timestamp())}", req.user_id, -req.points_to_spend, "boost", "Manual rank boost"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database update failed: {str(e)}")

    tier = ranking_engine.get_tier_by_score(new_score)
    
    return {
        "status": "success",
        "new_score": new_score,
        "new_tier": tier.name,
        "tokens_remaining": new_tokens
    }
