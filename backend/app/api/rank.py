from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.core.ranking import ranking_engine, RankInput
from app.db.supabase import supabase_client
from datetime import datetime

router = APIRouter()

class RankStatusResponse(BaseModel):
    user_id: str
    rank_score: float
    rank_tier: str
    profile_completeness_pct: int
    is_aadhaar_verified: bool
    is_elite: bool
    tips: List[str]

@router.get("/{user_id}/status", response_model=RankStatusResponse)
async def get_rank_status(user_id: str):
    """
    Returns a man's current rank score from Supabase.
    """
    response = supabase_client.table("profiles").select("*").eq("user_id", user_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Sovereign profile not found.")
    
    profile = response.data[0]
    
    # Calculate fresh tips based on current state
    tips = []
    if not profile.get("is_aadhaar_verified"):
        tips.append("✅ Complete Aadhaar verification to unlock +20 rank points")
    if profile.get("profile_completeness", 0) < 100:
        tips.append(f"📝 Complete your profile — currently {profile.get('profile_completeness')}%")
    if profile.get("rank_score", 0) < 50:
        tips.append("👥 Refer trusted friends to earn rank credits")

    return {
        "user_id": profile["user_id"],
        "rank_score": profile["rank_score"],
        "rank_tier": profile["rank_tier"],
        "profile_completeness_pct": profile["profile_completeness"],
        "is_aadhaar_verified": profile["is_aadhaar_verified"],
        "is_elite": profile["is_elite"],
        "tips": tips,
    }
