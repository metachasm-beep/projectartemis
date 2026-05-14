from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.ranking import ranking_engine
from app.core.security import auth_bearer
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
    action: str # 'match', 'skip', 'save', 'view'

class UnlockFilterRequest(BaseModel):
    unlock_type: str # 'session' or 'day'

@router.get("/potential-matches", response_model=List[DiscoveryResponse])
async def get_potential_matches(
    limit: int = 20, 
    offset: int = 0,
    verified_only: bool = False,
    user: dict = Depends(auth_bearer)
):
    """
    Discovery Engine 3.0 (Sovereign Gated):
    Fetches top-ranked aspirants for the authenticated Matriarch.
    Gated by JWT to ensure 'Hyper-Awareness' is confined to authorized sessions.
    """
    user_id = user["id"]
    
    # 1. Verify User Role
    user_res = await turso_client.execute("SELECT role FROM profiles WHERE user_id = ?", [user_id])
    if not user_res.rows:
        raise HTTPException(status_code=404, detail="Matriarch identity not found in Registry.")
    
    if user_res.rows[0].get("role") != "woman":
         raise HTTPException(status_code=403, detail="Discovery protocols are reserved for the Matriarch role.")

    # 2. Get Exclusions (already matched or skipped)
    matches = await turso_client.execute("SELECT man_id FROM resonances WHERE woman_id = ?", [user_id])
    skips = await turso_client.execute("SELECT man_id FROM selection_events WHERE woman_id = ? AND action = 'skip'", [user_id])
    
    exclude_ids = [m.get("man_id") for m in matches.rows] + [s.get("man_id") for s in skips.rows]

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
    
    for p in results.rows:
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
            id=p["user_id"],
            full_name=p.get("full_name"),
            bio=p.get("bio"),
            avatar_url=p.get("photos", "[]"),
            age=p_age,
            city=p.get("city"),
            aadhaar_verified=bool(p.get("aadhaar_verified")),
            rank_score=p.get("rank_score", 0.0),
            rank_tier_name=tier.name
        ))

    return potential_matches

@router.post("/select")
async def select_petitioner(request: SelectionRequest, user: dict = Depends(auth_bearer)):
    """Refined selection logic gated by authenticated Matriarch session."""
    woman_id = user["id"]
    
    # Verify woman role
    user_res = await turso_client.execute("SELECT role FROM profiles WHERE user_id = ?", [woman_id])
    if not user_res.rows or user_res.rows[0].get("role") != "woman":
        raise HTTPException(status_code=403, detail="Selection actions are restricted to the Matriarch.")

    # 1. Record Event
    event_id = f"sel_{int(datetime.now().timestamp())}_{woman_id[:4]}"
    await turso_client.execute(
        "INSERT INTO selection_events (id, woman_id, man_id, action) VALUES (?, ?, ?, ?)",
        [event_id, woman_id, request.man_id, request.action]
    )

    # 2. Handle Match (Resonance established)
    if request.action == "match":
        res_id = f"res_{int(datetime.now().timestamp())}_{woman_id[:4]}_{request.man_id[:4]}"
        await turso_client.execute(
            "INSERT INTO resonances (id, woman_id, man_id) VALUES (?, ?, ?)",
            [res_id, woman_id, request.man_id]
        )
        return {"status": "matched", "resonance_id": res_id}

    return {"status": "recorded", "action": request.action}

@router.get("/queue-status")
async def get_queue_status(user: dict = Depends(auth_bearer)):
    """
    Returns the count of Sovereigns (women) who are currently 'considering' the Aspirant.
    Returns 0 gracefully for non-man roles.
    """
    man_id = user["id"]

    # Gracefully return 0 for women and admins — no crash
    user_res = await turso_client.execute("SELECT role FROM profiles WHERE user_id = ?", [man_id])
    if not user_res.rows or user_res.rows[0].get("role") != "man":
        return {"count": 0}

    # Count distinct women who have Viewed or Saved (and aren't matched yet)
    query = """
    SELECT COUNT(DISTINCT woman_id) as count
    FROM selection_events
    WHERE man_id = ? AND action IN ('view', 'save')
    AND woman_id NOT IN (SELECT woman_id FROM resonances WHERE man_id = ?)
    """
    res = await turso_client.execute(query, [man_id, man_id])
    count = res.rows[0].get("count", 0)

    return {"count": count}

@router.post("/unlock-filter")
async def unlock_advanced_filter(request: UnlockFilterRequest, user: dict = Depends(auth_bearer)):
    """Spends Matriarch points to unlock discovery controls. Gated by identity."""
    user_id = user["id"]
    cost = 50 if request.unlock_type == 'day' else 10
    
    # 1. Check points
    res = await turso_client.execute("SELECT points FROM profiles WHERE user_id = ?", [user_id])
    if not res.rows:
        raise HTTPException(status_code=404, detail="Matriarch identity not found.")
    
    points = res.rows[0].get("points", 0)
    if points < cost:
        raise HTTPException(status_code=400, detail="Insufficient Sanctuary points for filter augmentation.")

    # 2. Deduct and Log Transaction
    new_points = points - cost
    tx_id = f"tx_filter_{int(datetime.now().timestamp())}"
    
    await turso_client.batch([
        ("UPDATE profiles SET points = ? WHERE user_id = ?", [new_points, user_id]),
        ("INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES (?, ?, ?, ?, ?)", 
         [tx_id, user_id, -cost, 'filter_unlock', f'Unlocked {request.unlock_type} filters'])
    ])

    return {"status": "success", "new_points": new_points, "unlocked": request.unlock_type}


@router.get("/gaze-count")
async def get_gaze_count(user: dict = Depends(auth_bearer)):
    """
    Returns the total cumulative count of profile views (Gaze Index) received by the 
    authenticated Aspirant (male user). Each time any Sovereign (woman) views his profile
    is recorded as a 'view' action in selection_events.
    """
    man_id = user["id"]

    # Gracefully return 0 for non-man roles
    user_res = await turso_client.execute("SELECT role FROM profiles WHERE user_id = ?", [man_id])
    if not user_res.rows or user_res.rows[0].get("role") != "man":
        return {"count": 0}

    res = await turso_client.execute(
        "SELECT COUNT(*) as count FROM selection_events WHERE man_id = ? AND action = 'view'",
        [man_id]
    )
    count = res.rows[0].get("count", 0) if res.rows else 0
    return {"count": count}

