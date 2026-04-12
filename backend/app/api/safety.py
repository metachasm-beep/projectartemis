from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.db.turso import turso_client
from datetime import datetime

router = APIRouter(prefix="/safety", tags=["safety"])

class ReportRequest(BaseModel):
    reported_id: str
    reason: str
    evidence_url: Optional[str] = None

class BlockRequest(BaseModel):
    blocked_id: str

@router.post("/report")
async def submit_report(request: ReportRequest, reporter_id: str):
    """Submits a report against a Registry identity."""
    # 1. Record the report
    report_id = f"rpt_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, evidence_url) VALUES (?, ?, ?, ?, ?)",
        [report_id, reporter_id, request.reported_id, request.reason, request.evidence_url]
    )

    # 2. Check and Auto-Block if necessary
    await _check_and_auto_block(request.reported_id)

    return {"status": "submitted", "report_id": report_id}

async def _check_and_auto_block(target_id: str):
    """Automatically shadowbans users with high report frequency."""
    # Count reports in Turso
    res = await turso_client.execute("SELECT COUNT(*) as count FROM reports WHERE reported_id = ?", [target_id])
    report_count = res[0].get("count", 0) if res else 0
    
    if report_count >= 3:
        # Heavily penalize rank score and mark status
        await turso_client.execute(
            "UPDATE profiles SET rank_score = rank_score * 0.5, onboarding_status = 'UNDER_REVIEW' WHERE user_id = ?",
            [target_id]
        )
        # Note: In a real system, we might set visibility = 0

@router.post("/block")
async def block_user(request: BlockRequest, blocker_id: str):
    """Mutually blocks discovery between two identities."""
    await turso_client.execute(
        "INSERT OR IGNORE INTO blocks (blocker_id, blocked_id) VALUES (?, ?)",
        [blocker_id, request.blocked_id]
    )
    return {"status": "blocked"}

@router.post("/grievance")
async def submit_grievance(subject: str, description: str, user_id: str):
    """Submits a formal protocol grievance."""
    report_id = f"grv_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, status) VALUES (?, ?, ?, ?, 'grievance')",
        [report_id, user_id, "SYSTEM_ADMIN", f"{subject}: {description}"]
    )
    return {"status": "submitted"}
