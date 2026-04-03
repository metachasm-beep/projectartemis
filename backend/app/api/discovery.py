from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.supabase import supabase_client
from app.models.user import UserRole, Profile
from datetime import datetime, date, timezone
import uuid

router = APIRouter(prefix="/discovery", tags=["discovery"])

class DiscoveryResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    full_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    age: Optional[int]
    city: Optional[str]
    aadhaar_verified: bool
    rank_score: float
    is_new: bool = False
    trust_score: int = 0
    last_audited: Optional[str] = None

class SelectionRequest(BaseModel):
    man_id: uuid.UUID
    action: str # 'match', 'skip', 'save'

@router.get("/potential-matches", response_model=List[DiscoveryResponse])
async def get_potential_matches(user_id: uuid.UUID, limit: int = 20, offset: int = 0):
    """
    Discovery Engine 2.0:
    Step 1: Eligibility Filter (blocked, matched, skipped)
    Step 2: Rank Ordering
    Step 3: Feed Balancing (Freshness)
    Step 4: Delivery (Pagination)
    """
    # 1. Verify User Role
    user_res = supabase_client.table("users").select("role").eq("id", str(user_id)).execute()
    if not user_res.data:
        raise HTTPException(status_code=404, detail="Sovereign user not found")
    
    role = user_res.data[0]["role"]
    if role != UserRole.woman:
        return [] 

    # 2. Get Step 1 Filters (IDs to exclude)
    # Exclude matched
    matches_res = supabase_client.table("matches").select("man_id").eq("woman_id", str(user_id)).execute()
    matched_ids = {item["man_id"] for item in matches_res.data}
    
    # Exclude skipped
    skips_res = supabase_client.table("selection_events").select("man_id").eq("woman_id", str(user_id)).eq("action", "skip").execute()
    skipped_ids = {item["man_id"] for item in skips_res.data}
    
    # Exclude blocks
    blocks_res = supabase_client.table("blocks").select("blocked_id").eq("blocker_id", str(user_id)).execute()
    blocked_ids = {item["blocked_id"] for item in blocks_res.data}
    
    # Exclude self (though filter by role does this, good for safety)
    exclude_ids = matched_ids.union(skipped_ids).union(blocked_ids)

    # 3. Fetch Potential Candidates (Step 2: Rank Ordering)
    query = supabase_client.table("male_rank_profiles") \
        .select("rank_score, user_id, profiles!inner(*)") \
        .eq("is_visible", True) \
        .eq("is_shadowbanned", False) \
        .order("rank_score", desc=True)

    response = query.execute()
    
    # 4. Filter and Apply Step 3: Feed Balancing (Freshness)
    potential_matches = []
    now = datetime.now(timezone.utc)
    
    for item in response.data:
        p_user_id = item["user_id"]
        if p_user_id in exclude_ids:
            continue
            
        profile = item["profiles"]
        
        # Freshness Check
        created_at_str = profile.get("created_at")
        is_new = False
        if created_at_str:
            created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
            is_new = (now - created_at).days < 7
        
        # Calculate Age
        age = None
        if profile.get("date_of_birth"):
            dob = date.fromisoformat(profile["date_of_birth"])
            today = date.today()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

        # Step 3: Sovereign Rank Boost (Freshness + Trust)
        trust_val = profile.get("trust_score", 0)
        boosted_rank = item["rank_score"] + (10.0 if is_new else 0.0) + (trust_val / 5.0)

        potential_matches.append(DiscoveryResponse(
            id=profile["id"],
            user_id=p_user_id,
            full_name=profile["full_name"],
            bio=profile["bio"],
            avatar_url=profile["avatar_url"],
            age=age,
            city=profile["city"],
            aadhaar_verified=profile["aadhaar_verified"],
            rank_score=boosted_rank,
            is_new=is_new,
            trust_score=trust_val,
            last_audited=profile.get("last_audited")
        ))

    # Re-sort after freshness boost
    potential_matches.sort(key=lambda x: x.rank_score, reverse=True)

    # Step 4: Final Feed Delivery (Pagination)
    return potential_matches[offset : offset + limit]

@router.post("/select")
async def select_petitioner(request: SelectionRequest, woman_id: uuid.UUID):
    """
    Matriarch selects, skips, or saves a Petitioner.
    If 'match', an active match is created in 'none' communication mode.
    """
    # 1. Verify Role
    user_res = supabase_client.table("users").select("role").eq("id", str(woman_id)).execute()
    if not user_res.data or user_res.data[0]["role"] != UserRole.woman:
        raise HTTPException(status_code=403, detail="Only Matriarchs can initiate selections")

    # 2. Record Discovery Action (replaces/augments selection_events)
    # This feeds into the Step 1 filtering logic.
    supabase_client.table("discovery_actions").insert({
        "woman_id": str(woman_id),
        "man_id": str(request.man_id),
        "action_type": request.action
    }).execute()

    # 3. Create Match if 'match' action
    if request.action == "match":
        # Check if match already exists to avoid conflict
        match_exists = supabase_client.table("matches") \
            .select("*") \
            .eq("woman_id", str(woman_id)) \
            .eq("man_id", str(request.man_id)) \
            .execute()
        
        if not match_exists.data:
             # Create match in 'none' mode first
            match_res = supabase_client.table("matches").insert({
                "woman_id": str(woman_id),
                "man_id": str(request.man_id),
                "status": "active",
                "comm_mode": "none"
            }).execute()
            
            # Create conversation for the match
            if match_res.data:
                match_id = match_res.data[0]["id"]
                supabase_client.table("conversations").insert({
                    "match_id": match_id
                }).execute()
            
            return {"status": "matched", "message": "Connection established. Choose communication mode next."}

    return {"status": "recorded", "action": request.action}
