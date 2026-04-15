from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.security import auth_bearer
from datetime import datetime
import uuid

router = APIRouter(prefix="/safety", tags=["safety"])

class ReportRequest(BaseModel):
    reported_id: str
    reason: str
    evidence_url: Optional[str] = None

class BlockRequest(BaseModel):
    blocked_id: str

class GrievanceRequest(BaseModel):
    subject: str
    description: str

@router.post("/report")
async def submit_report(request: ReportRequest, user: dict = Depends(auth_bearer)):
    """Submits a report against a Registry identity. Gated by session."""
    reporter_id = user["id"]
    
    # 1. Record the report
    report_id = f"rpt_{uuid.uuid4().hex[:8]}"
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, evidence_url) VALUES (?, ?, ?, ?, ?)",
        [report_id, reporter_id, request.reported_id, request.reason, request.evidence_url]
    )

    # 2. Check and Auto-Block if necessary (Shadowban threshold)
    await _check_and_auto_block(request.reported_id)

    return {"status": "submitted", "report_id": report_id, "audited": True}

async def _check_and_auto_block(target_id: str):
    """Automatically shadowbans users with high report frequency."""
    res = await turso_client.execute("SELECT COUNT(*) as count FROM reports WHERE reported_id = ?", [target_id])
    if not res.rows:
        return
        
    report_count = res.rows[0].get("count", 0)
    
    if report_count >= 3:
        # Heavily penalize rank score and flag for review
        # Multiplier of 0.5 (50% standing loss)
        await turso_client.execute(
            "UPDATE profiles SET rank_score = rank_score * 0.5, onboarding_status = 'UNDER_REVIEW', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            [target_id]
        )

@router.post("/block")
async def block_user(request: BlockRequest, user: dict = Depends(auth_bearer)):
    """Mutually blocks discovery between two identities. Gated by session."""
    blocker_id = user["id"]
    await turso_client.execute(
        "INSERT OR IGNORE INTO blocks (blocker_id, blocked_id) VALUES (?, ?)",
        [blocker_id, request.blocked_id]
    )
    return {"status": "blocked", "target": request.blocked_id}

@router.post("/grievance")
async def submit_grievance(request: GrievanceRequest, user: dict = Depends(auth_bearer)):
    """Submits a formal protocol grievance. Gated by session."""
    user_id = user["id"]
    report_id = f"grv_{uuid.uuid4().hex[:8]}"
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, status) VALUES (?, ?, ?, ?, 'grievance')",
        [report_id, user_id, "SYSTEM_ADMIN", f"{request.subject}: {request.description}"]
    )
    return {"status": "submitted", "grievance_id": report_id}
