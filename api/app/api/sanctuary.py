from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import auth_bearer
from app.api.deps import get_sanctuary_service, SanctuaryService
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sanctuary", tags=["Sanctuary"])

class JumpRequest(BaseModel):
    user_id: str
    jump_percent: int

class IntegrityBonusRequest(BaseModel):
    user_id: str
    integrity_score: int

class SignalRequest(BaseModel):
    man_id: str
    metric_type: str # 'impression' | 'visit' | 'save'
    woman_id: Optional[str] = None


@router.post("/recalculate-ranks")
async def recalculate_ranks(
    user: dict = Depends(auth_bearer),
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """
    Sovereign Atomic Reflow: Re-indexes the entire sanctuary hierarchy.
    Enforces absolute rank exclusivity across the active population.
    """
    if user.get("role") != "admin" and not user.get("is_influencer"):
        # Allow admins or authorized system roles
        raise HTTPException(status_code=403, detail="Clearance required for global rank reflow.")

    success = await sanctuary_service.recalculate_global_ranks()
    if not success:
        raise HTTPException(status_code=500, detail="Failed to execute atomic rank reflow.")
    return {"status": "reflow_complete"}


@router.post("/jump")
async def purchase_jump(
    request: JumpRequest,
    user: dict = Depends(auth_bearer),
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """
    AURA Tokenomics: Percentile Leap Protocol.
    Converts purchased aura tokens into weighted rank score leaps.
    """
    if user["id"] != request.user_id:
        raise HTTPException(status_code=403, detail="Cannot purchase leaps for other accounts.")

    points = await sanctuary_service.purchase_jump(request.user_id, request.jump_percent)
    return {"status": "jump_executed", "jump_percent": request.jump_percent, "points_awarded": points}


@router.post("/seal")
async def purchase_seal(
    request: dict,
    user: dict = Depends(auth_bearer),
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """
    The ultimate seal: 1,000,000 point boost to secure Rank #1 position.
    """
    user_id = request.get("user_id")
    if user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Unauthorized seal acquisition.")

    success = await sanctuary_service.purchase_seal_of_excellence(user_id)
    return {"status": "seal_acquired", "points_awarded": 1000000}


@router.post("/integrity-bonus")
async def sync_integrity_bonus(
    request: IntegrityBonusRequest,
    user: dict = Depends(auth_bearer),
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """
    Dossier Resonance Sync: Rewards rank_score based on profile integrity.
    """
    if user["id"] != request.user_id:
        raise HTTPException(status_code=403, detail="Unauthorized integrity calibration.")

    bonus = await sanctuary_service.sync_integrity_bonus(request.user_id, request.integrity_score)
    return {"status": "integrity_calibrated", "integrity_score": request.integrity_score, "bonus_awarded": bonus}


@router.post("/signals")
async def track_signal(
    request: SignalRequest,
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """
    Sanctuary Signals: The Feedback Loop.
    Tracks impressions, profile visits, and shortlist saves.
    """
    success = await sanctuary_service.track_signal(request.man_id, request.metric_type, request.woman_id)
    return {"status": "signal_tracked", "success": success}


@router.get("/metrics/{user_id}")
async def get_metrics(
    user_id: str,
    user: dict = Depends(auth_bearer),
    sanctuary_service: SanctuaryService = Depends(get_sanctuary_service)
):
    """
    Retrieves cumulative Gaze Index metrics for an Aspirant.
    """
    if user["id"] != user_id and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Unauthorized metrics access.")

    metrics = await sanctuary_service.get_signal_metrics(user_id)
    return {"user_id": user_id, "metrics": metrics}
