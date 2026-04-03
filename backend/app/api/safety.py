from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.supabase import supabase_client
import uuid

router = APIRouter(prefix="/safety", tags=["safety"])

class ReportRequest(BaseModel):
    reported_id: uuid.UUID
    reason: str
    evidence_url: Optional[str] = None

class BlockRequest(BaseModel):
    blocked_id: uuid.UUID

@router.post("/report")
async def submit_report(request: ReportRequest, reporter_id: uuid.UUID):
    """
    Submits a report against a user. 
    Recorded in public.reports and updates victim's safety profile risk score.
    """
    # 1. Record the report
    report_res = supabase_client.table("reports").insert({
        "reporter_id": str(reporter_id),
        "reported_id": str(request.reported_id),
        "reason": request.reason,
        "evidence_url": request.evidence_url,
        "status": "open"
    }).execute()

    # 2. Update reported user's safety profile (Increment report count)
    # This feeds into rank penalties in the next scoring cycle.
    supabase_client.rpc("increment_report_count", {"target_user_id": str(request.reported_id)}).execute()
    
    # 3. Check and Auto-Block if necessary
    await _check_and_auto_block(str(request.reported_id))

    return {"status": "submitted", "report_id": report_res.data[0]["id"] if report_res.data else None}

async def _check_and_auto_block(target_user_id: str):
    """
    Sovereign Guard: Automatically shadowbans users with >= 3 reports.
    """
    # 1. Get current report count
    count_res = supabase_client.table("safety_profiles").select("report_count").eq("user_id", target_user_id).execute()
    if count_res.data:
        report_count = count_res.data[0]["report_count"]
        if report_count >= 3:
            # AUTO-BLOCK: Shadowban the user
            supabase_client.table("male_rank_profiles").update({"is_shadowbanned": True, "is_visible": False}).eq("user_id", target_user_id).execute()
            # Also record in audit log
            supabase_client.table("audit_logs").insert({
                "user_id": target_user_id,
                "action_type": "auto_block",
                "details": f"User reached report threshold: {report_count}"
            }).execute()

@router.post("/block")
async def block_user(request: BlockRequest, blocker_id: uuid.UUID):
    """
    Blocks a user. Prevents future discovery in Step 1 filtering.
    """
    supabase_client.table("blocks").insert({
        "blocker_id": str(blocker_id),
        "blocked_id": str(request.blocked_id)
    }).execute()

    return {"status": "blocked"}

@router.post("/grievance")
async def submit_grievance(subject: str, description: str, user_id: uuid.UUID):
    """
    Submits a legal/protocol grievance for admin review.
    """
    supabase_client.table("grievance_tickets").insert({
        "user_id": str(user_id),
        "subject": subject,
        "description": description
    }).execute()

    return {"status": "submitted"}
