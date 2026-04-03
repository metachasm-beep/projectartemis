from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.db.supabase import supabase_client
import uuid
from datetime import datetime

router = APIRouter()

class FeedRequest(BaseModel):
    woman_id: str
    min_age: int = 18
    max_age: int = 50
    max_distance_km: int = 100
    aadhaar_verified_only: bool = False
    excluded_ids: List[str] = []

class SelectionRequest(BaseModel):
    woman_id: str
    man_id: str
    action: str  # "match", "skip", "save"

@router.post("/feed")
async def get_discovery_feed(req: FeedRequest):
    """
    Returns a curated ranked feed of men from Supabase.
    """
    query = supabase_client.table("profiles").select("*").eq("is_elite", True)
    
    if req.aadhaar_verified_only:
        query = query.eq("is_aadhaar_verified", True)
    
    # Filter by age
    query = query.gte("age", req.min_age).lte("age", req.max_age)
    
    # Exclude already seen ids
    if req.excluded_ids:
        query = query.not_.in_("user_id", req.excluded_ids)
        
    response = query.order("rank_score", desc=True).limit(20).execute()
    
    return {"feed": response.data, "count": len(response.data)}

@router.post("/select")
async def select_action(req: SelectionRequest):
    """
    Records a selection action and creates a Match if applicable.
    Logs actions in discovery_logs for 180-day audit retention.
    """
    if req.action not in ["match", "skip", "save"]:
        raise HTTPException(status_code=400, detail="Invalid action.")

    # 1. Log the action for DPDP 2026/Audit compliance
    log_data = {
        "woman_id": req.woman_id,
        "man_id": req.man_id,
        "action": req.action,
        "metadata": {"source": "pwa_discovery"}
    }
    supabase_client.table("discovery_logs").insert(log_data).execute()

    # 2. If 'match', create a record in matches table
    match_created = False
    if req.action == "match":
        match_data = {
            "woman_id": req.woman_id,
            "man_id": req.man_id,
            "status": "active"
        }
        supabase_client.table("matches").insert(match_data).execute()
        match_created = True

    return {
        "status": "recorded",
        "action": req.action,
        "match_created": match_created
    }
