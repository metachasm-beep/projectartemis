from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.core.ranking import ranking_engine
from app.core.security import auth_bearer
from app.db.turso import turso_client
from datetime import datetime, timedelta
import json
import asyncio
import uuid

router = APIRouter(prefix="/rank", tags=["rank"])

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
    points_to_spend: int = 100

# 🛡️ THE PROTOCOL: SERVER-SIDE STREAK & DECAY
async def process_protocol_heartbeat(profile: dict):
    """
    Enforces daily entry rewards and silence-based rank decay.
    Moves logic from frontend (AuthContext) to secure Registry ledger.
    """
    user_id = profile["user_id"]
    last_login_str = profile.get("last_login_at")
    consecutive_days = profile.get("consecutive_days", 0)
    current_score = profile.get("rank_score", 0.0)
    
    now = datetime.now()
    new_streak = consecutive_days
    score_delta = 0.0

    if not last_login_str:
        # First login ever
        new_streak = 1
        score_delta = 10.0 # Initial reward
    else:
        last_login = datetime.fromisoformat(last_login_str)
        diff = now - last_login
        diff_days = diff.days

        # 📈 STREAK REWARD: New day check
        if diff_days == 1:
            new_streak += 1
            score_delta = 10.0 # Daily reliability bonus
        elif diff_days > 1:
            # 📉 RESONANCE DECAY PROTOCOL: Triggered if silence > 3 days
            if diff_days >= 3:
                decay_pct = min(0.15, 0.02 * diff_days) # Cap at 15%
                score_delta = -(current_score * decay_pct)
                logger_msg = f"RESONANCE_DECAY: Identity silent for {diff_days} days. Applying -{abs(score_delta)} penalty."
                print(logger_msg) # Placeholder for proper audit log
            
            new_streak = 1 if diff_days < 3 else 0 # Reset streak if gap is large

    if score_delta != 0 or new_streak != consecutive_days:
        # Commit to Registry
        new_score = max(0.0, current_score + score_delta)
        now_iso = now.isoformat()
        
        # Batch update for atomicity
        tx_id = f"stk_{uuid.uuid4().hex[:8]}"
        await turso_client.batch([
            f"UPDATE profiles SET rank_score = {new_score}, consecutive_days = {new_streak}, last_login_at = '{now_iso}', updated_at = '{now_iso}' WHERE user_id = '{user_id}'",
            f"INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES ('{tx_id}', '{user_id}', {int(score_delta)}, 'streak_sync', 'Daily protocol heartbeat sync')"
        ])
        return new_score, new_streak
    
    return current_score, new_streak

@router.get("/status", response_model=RankStatusResponse)
async def get_rank_status(user: dict = Depends(auth_bearer)):
    """
    Returns a user's current status, enforcing server-side Protocol heartbeats.
    Gated by High-Status Sovereignty (JWT).
    """
    user_id = user["id"]
    
    # 1. Fetch Profile (Full state)
    res = await turso_client.execute("SELECT * FROM profiles WHERE user_id = ?", [user_id])
    if not res.rows:
        raise HTTPException(status_code=404, detail="Matriarch identity not found in Registry.")
    
    raw_profile = res.rows[0]
    
    # 2. RUN PROTOCOL HEARTBEAT (Server-side Streaks/Decay)
    score, streak = await process_protocol_heartbeat(raw_profile)
    city = raw_profile.get("city", "Delhi")
    
    # 3. Parallel Metrics Calculation
    metrics_tasks = [
        turso_client.execute("SELECT COUNT(*) as count FROM selection_events WHERE woman_id = ?", [user_id]),
        turso_client.execute("SELECT COUNT(*) as count FROM resonances WHERE woman_id = ?", [user_id]),
        turso_client.execute("SELECT COUNT(*) as count FROM selection_events WHERE woman_id = ? AND created_at > datetime('now', '-1 day')", [user_id]),
        turso_client.execute("SELECT COUNT(*) + 1 as standing FROM profiles WHERE city = ? AND rank_score > ?", [city, score]),
        turso_client.execute("SELECT COUNT(*) as count FROM point_transactions WHERE user_id = ? AND delta > 0", [user_id])
    ]
    
    results = await asyncio.gather(*metrics_tasks)
    
    total_selections = results[0].rows[0].get("count", 0)
    total_matches = results[1].rows[0].get("count", 0)
    recent_selections = results[2].rows[0].get("count", 0)
    city_standing = results[3].rows[0].get("standing", 1)
    saves_count = results[4].rows[0].get("count", 0) # Using transactions as proxy for saves in this schema
    
    precision = (total_matches / total_selections) * 100 if total_selections > 0 else 0.0
    
    # 4. Get Tier Info from Engine
    tier = ranking_engine.get_tier_by_score(score)
    next_info = ranking_engine.get_next_tier_info(score)
    
    # 5. Dynamic Tips
    tips = []
    if not raw_profile.get("is_verified"):
        tips.append("Complete Biometric Check to gain 500 status points.")
    if raw_profile.get("profile_completeness", 0) < 80:
        tips.append("Deepen your dossier to stabilize your standing.")

    return RankStatusResponse(
        user_id=user_id,
        rank_score=score,
        rank_tier=tier.id,
        rank_tier_name=tier.name,
        profile_completeness_pct=int(raw_profile.get("profile_completeness", 0) or 0),
        is_aadhaar_verified=bool(raw_profile.get("aadhaar_verified")),
        consecutive_days=streak,
        total_session_seconds=int(raw_profile.get("total_session_seconds", 0) or 0),
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
async def apply_rank_boost(req: BoostRequest, user: dict = Depends(auth_bearer)):
    """
    Augments a user's standing via token expenditure.
    Gated and validated server-side.
    """
    user_id = user["id"]
    
    res = await turso_client.execute("SELECT rank_score, tokens FROM profiles WHERE user_id = ?", [user_id])
    if not res.rows:
        raise HTTPException(status_code=404, detail="User not found.")
    
    current_score = res.rows[0].get("rank_score", 0.0)
    current_tokens = res.rows[0].get("tokens", 0)

    if current_tokens < req.points_to_spend:
        raise HTTPException(status_code=400, detail="Insufficient tokens for status augmentation.")

    new_score = ranking_engine.apply_boost(current_score, req.points_to_spend)
    new_tokens = current_tokens - req.points_to_spend

    try:
        tx_id = f"boost_{int(datetime.now().timestamp())}"
        await turso_client.batch([
            f"UPDATE profiles SET rank_score = {new_score}, tokens = {new_tokens}, updated_at = CURRENT_TIMESTAMP WHERE user_id = '{user_id}'",
            f"INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES ('{tx_id}', '{user_id}', {-req.points_to_spend}, 'boost', 'Manual status boost')"
        ])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sovereign Registry sync failed: {str(e)}")

    tier = ranking_engine.get_tier_by_score(new_score)
    
    return {
        "status": "success",
        "new_score": new_score,
        "new_tier": tier.name,
        "tokens_remaining": new_tokens
    }
