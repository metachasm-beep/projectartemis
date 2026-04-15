from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.core.ranking import ranking_engine
from app.db.turso import turso_client
from datetime import datetime
import json
import asyncio

router = APIRouter()

class RankStatusResponse(BaseModel):
    user_id: str
    rank_score: float
    rank_tier: str
    rank_tier_name: str
    profile_completeness_pct: int
    is_aadhaar_verified: bool
    consecutive_days: int
    total_session_seconds: int
    selection_precision: float
    vetting_velocity: int
    sanctum_standing: int
    vibe_rating: float
    response_rate: str
    saves_count: int
    matches_count: int
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
    Checks all high-fidelity metrics for the Sovereign Dashboard.
    """
    # 1. Fetch Profile
    res = await turso_client.execute("SELECT * FROM profiles WHERE user_id = ?", [user_id])
    if not res:
        raise HTTPException(status_code=404, detail="Matriarch user not found.")
    
    profile = res[0]
    score = profile.get("rank_score", 0.0)
    city = profile.get("city", "Delhi")
    
    # 2. Parallel Metrics Calculation
    # Selection precision, vetting velocity, and city standing
    metrics_tasks = [
        turso_client.execute("SELECT COUNT(*) as count FROM selection_events WHERE woman_id = ?", [user_id]),
        turso_client.execute("SELECT COUNT(*) as count FROM matches WHERE woman_user_id = ?", [user_id]),
        turso_client.execute("SELECT COUNT(*) as count FROM selection_events WHERE woman_id = ? AND created_at > datetime('now', '-1 day')", [user_id]),
        turso_client.execute("SELECT COUNT(*) + 1 as standing FROM profiles WHERE city = ? AND rank_score > ?", [city, score]),
        turso_client.execute("SELECT COUNT(*) as count FROM saves WHERE user_id = ?", [user_id])
    ]
    
    results = await asyncio.gather(*metrics_tasks)
    
    total_selections = results[0][0].get("count", 0)
    total_matches = results[1][0].get("count", 0)
    recent_selections = results[2][0].get("count", 0)
    city_standing = results[3][0].get("standing", 1)
    saves_count = results[4][0].get("count", 0)
    
    precision = (total_matches / total_selections) * 100 if total_selections > 0 else 0.0
    
    # 3. Get Tier Info from Engine
    tier = ranking_engine.get_tier_by_score(score)
    next_info = ranking_engine.get_next_tier_info(score)
    
    # 4. Dynamic Tips
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
        consecutive_days=int(profile.get("consecutive_days", 0)),
        total_session_seconds=int(profile.get("total_session_seconds", 0)),
        selection_precision=round(precision, 1),
        vetting_velocity=int(recent_selections),
        sanctum_standing=int(city_standing),
        vibe_rating=round(min(10.0, score / 1000.0), 1),
        response_rate="Pulse: High",
        saves_count=int(saves_count),
        matches_count=int(total_matches),
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
