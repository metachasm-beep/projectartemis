from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from app.core.ranking import ranking_engine, RankInput
from app.db.supabase import supabase_client
from datetime import datetime, timezone

router = APIRouter()

class RankStatusResponse(BaseModel):
    user_id: str
    rank_score: float
    rank_tier: str
    profile_completeness_pct: int
    is_aadhaar_verified: bool
    is_elite: bool
    tips: List[str]
    points: int = 0

class BoostRequest(BaseModel):
    user_id: str
    points_to_spend: int = 100 # Default boost cost

@router.get("/{user_id}/status", response_model=RankStatusResponse)
async def get_rank_status(user_id: str):
    """
    Returns a user's current status and protocol standing.
    """
    # 1. Fetch User Role
    user_res = supabase_client.table("users").select("role").eq("id", user_id).execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="Matriarch user not found.")
    
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
            tips.append("⚠️ Verify Aadhaar to unlock +20 Matriarchty Points")
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
            "tips": tips,
            "points": profile.get("points") or 0
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
            "tips": ["Observation Protocol Active — Select to connect."],
            "points": profile.get("points") or 0
        }

@router.post("/boost")
async def apply_rank_boost(request: BoostRequest):
    """
    Spends points to increase a Petitioner's rank score.
    """
    # 1. Fetch Profile & Rank Data
    profile_res = supabase_client.table("profiles").select("points, user_role").eq("user_id", request.user_id).execute()
    if not profile_res.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = profile_res.data[0]
    points = profile.get("points") or 0

    # Enforce Petitioner role for rank boosts
    user_role_res = supabase_client.table("users").select("role").eq("id", request.user_id).execute()
    if not user_role_res.data or user_role_res.data[0]["role"] != "man":
        raise HTTPException(status_code=403, detail="Rank boosts are only available for Petitioners.")

    # 2. Check points
    if points < request.points_to_spend:
        raise HTTPException(status_code=400, detail="Insufficient points for a rank boost. Refer others to earn more.")

    # 3. Calculate Reward
    # 100 points = +5 rank_score
    rank_delta = (request.points_to_spend / 20.0)

    # 4. Perform Update (Atomic-ish)
    # Deduct points
    new_points = points - request.points_to_spend
    supabase_client.table("profiles").update({"points": new_points}).eq("user_id", request.user_id).execute()

    # Increase rank
    rank_res = supabase_client.table("male_rank_profiles").select("rank_score").eq("user_id", request.user_id).execute()
    if rank_res.data:
        current_rank = rank_res.data[0].get("rank_score") or 0
        supabase_client.table("male_rank_profiles").update({
            "rank_score": current_rank + rank_delta,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }).eq("user_id", request.user_id).execute()

    # 5. Record Transaction
    supabase_client.table("point_transactions").insert({
        "user_id": request.user_id,
        "delta": -request.points_to_spend,
        "transaction_type": "rank_boost",
        "notes": f"Purchased visibility boost (+{rank_delta} score)"
    }).execute()

    return {"status": "success", "new_points": new_points, "rank_added": rank_delta}
