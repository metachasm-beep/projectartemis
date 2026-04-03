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
    Returns a user's current status and protocol standing.
    """
    # 1. Fetch User Role
    user_res = supabase_client.table("users").select("role").eq("id", user_id).execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="Sovereign user not found.")
    
    role = user_res.data[0]["role"]
    
    profile_res = supabase_client.table("profiles").select("*").eq("user_id", user_id).execute()
    profile = profile_res.data[0] if profile_res.data else {}

    if role == "man":
        # Petitioner logic
        rank_res = supabase_client.table("male_rank_profiles").select("*").eq("user_id", user_id).execute()
        rank_data = rank_res.data[0] if rank_res.data else {"rank_score": 0}
        score = rank_data.get("rank_score", 0)
        tier = "elite" if score > 80 else "high" if score > 50 else "standard"
        
        # Calculate dynamic tips
        tips = []
        is_verified = profile.get("aadhaar_verified", False)
        completeness = profile.get("completeness_score", 0)
        
        if not is_verified:
            tips.append("⚠️ Verify Aadhaar to unlock +20 Sovereignty Points")
        else:
            tips.append("✅ Aadhaar identity confirmed")
            
        if completeness < 100:
            tips.append(f"📝 Complete profile ({completeness}%) to reach Priority visibility")
        
        if score < 50:
            tips.append("👥 Refer highly-vetted friends to gain Referral Credits")
            
        return {
            "user_id": user_id,
            "rank_score": score,
            "rank_tier": tier,
            "profile_completeness_pct": completeness,
            "is_aadhaar_verified": is_verified,
            "is_elite": score > 90,
            "tips": tips
        }
    else:
        # Matriarch logic
        selection_count = supabase_client.table("selection_events").select("id", count="exact").eq("woman_id", user_id).execute()
        return {
            "user_id": user_id,
            "rank_score": float(selection_count.count or 0),
            "rank_tier": "matriarch",
            "profile_completeness_pct": 100,
            "is_aadhaar_verified": True,
            "is_elite": True,
            "tips": ["Observation Protocol Active — Select to connect."]
        }
