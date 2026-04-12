from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.ranking import ranking_engine
from datetime import datetime, date
import json

router = APIRouter(prefix="/discovery", tags=["discovery"])

class DiscoveryResponse(BaseModel):
    user_id: str
    id: str # profile id
    full_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    age: Optional[int]
    city: Optional[str]
    aadhaar_verified: bool
    rank_score: float
    rank_tier_name: str
    is_new: bool = False

class SelectionRequest(BaseModel):
    man_id: str
    action: str # 'match', 'skip', 'save'

class UnlockFilterRequest(BaseModel):
    user_id: str
    unlock_type: str # 'session' or 'day'

@router.get("/potential-matches", response_model=List[DiscoveryResponse])
async def get_potential_matches(
    user_id: str, 
    limit: int = 20, 
    offset: int = 0,
    verified_only: bool = False
):
    """
    Discovery Engine 3.0 (Turso Powered):
    Fetches top-ranked aspirants not yet matched or skipped.
    """
    # 1. Verify User Role
    user_res = await turso_client.execute("SELECT role FROM profiles WHERE user_id = ?", [user_id])
    if not user_res:
        raise HTTPException(status_code=404, detail="Matriarch user not found")
    
    if user_res[0].get("role") != "woman":
         return []

    # 2. Get Exclusions (already matched or skipped)
    matches = await turso_client.execute("SELECT man_id FROM resonances WHERE woman_id = ?", [user_id])
    skips = await turso_client.execute("SELECT man_id FROM selection_events WHERE woman_id = ? AND action = 'skip'", [user_id])
    
    exclude_ids = [m.get("man_id") for m in matches] + [s.get("man_id") for s in skips]

    # 3. Primary Query for Men
    sql = "SELECT * FROM profiles WHERE role = 'man'"
    params = []
    
    if verified_only:
        sql += " AND aadhaar_verified = 1"
    
    if exclude_ids:
        placeholders = ",".join(["?"] * len(exclude_ids))
        sql += f" AND user_id NOT IN ({placeholders})"
        params.extend(exclude_ids)

    sql += " ORDER BY rank_score DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])

    results = await turso_client.execute(sql, params)
    
    potential_matches = []
    today = date.today()
    
    for p in results:
        # Calculate Age
        p_age = None
        dob_str = p.get("date_of_birth")
        if dob_str:
            try:
                dob = date.fromisoformat(dob_str)
                p_age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            except:
                pass
        
        tier = ranking_engine.get_tier_by_score(p.get("rank_score", 0.0))
        
        potential_matches.append(DiscoveryResponse(
            user_id=p["user_id"],
            id=p["user_id"], # In Turso schema, user_id is the primary identifier for profile
            full_name=p.get("full_name"),
            bio=p.get("bio"),
            avatar_url=p.get("photos", "[]"), # Note: frontend expect string or array
            age=p_age,
            city=p.get("city"),
            aadhaar_verified=bool(p.get("aadhaar_verified")),
            rank_score=p.get("rank_score", 0.0),
            rank_tier_name=tier.name
        ))

    return potential_matches

@router.post("/select")
async def select_petitioner(request: SelectionRequest, woman_id: str):
    """Refined selection logic using Turso ledger."""
    
    # 1. Record Event
    event_id = f"sel_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO selection_events (id, woman_id, man_id, action) VALUES (?, ?, ?, ?)",
        [event_id, woman_id, request.man_id, request.action]
    )

    # 2. Handle Match
    if request.action == "match":
        res_id = f"res_{int(datetime.now().timestamp())}"
        await turso_client.execute(
            "INSERT INTO resonances (id, woman_id, man_id) VALUES (?, ?, ?)",
            [res_id, woman_id, request.man_id]
        )
        return {"status": "matched", "message": "Connection established in the Registry."}

    return {"status": "recorded", "action": request.action}

@router.post("/unlock-filter")
async def unlock_advanced_filter(request: UnlockFilterRequest):
    """Spends Matriarch points to unlock discovery controls."""
    cost = 50 if request.unlock_type == 'day' else 10
    
    # 1. Check points
    res = await turso_client.execute("SELECT points FROM profiles WHERE user_id = ?", [request.user_id])
    if not res:
        raise HTTPException(status_code=404, detail="Matriarch not found.")
    
    points = res[0].get("points", 0)
    if points < cost:
        raise HTTPException(status_code=400, detail="Insufficient Sanctuary points.")

    # 2. Deduct and Log
    new_points = points - cost
    await turso_client.execute("UPDATE profiles SET points = ? WHERE user_id = ?", [new_points, request.user_id])
    
    tx_id = f"tx_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES (?, ?, ?, ?, ?)",
        [tx_id, request.user_id, -cost, "filter_unlock", f"Unlocked {request.unlock_type} filters"]
    )

    return {"status": "success", "new_points": new_points}
