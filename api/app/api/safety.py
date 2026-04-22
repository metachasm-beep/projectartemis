from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional, Dict
from pydantic import BaseModel, AnyHttpUrl, Field
from app.db.turso import turso_client
from app.core.security import auth_bearer
from datetime import datetime, timedelta
import uuid
import time

router = APIRouter(prefix="/safety", tags=["safety"])

# --- 🛡️ Rate Limiting Protocols ---
# Simple in-memory rate limiter for demo/initial production.
# In a distributed monolith, this should be moved to Redis (e.g. via slowapi).
class RateLimiter:
    def __init__(self, requests: int, window: int):
        self.requests = requests
        self.window = window
        self.history: Dict[str, List[float]] = {}

    def is_allowed(self, key: str) -> bool:
        now = time.time()
        if key not in self.history:
            self.history[key] = []
        
        # Clean up old entries
        self.history[key] = [t for t in self.history[key] if t > now - self.window]
        
        if len(self.history[key]) >= self.requests:
            return False
        
        self.history[key].append(now)
        return True

# Protocols: 5 reports/hr, 10 blocks/hr, 3 grievances/hr per identity
report_limiter = RateLimiter(5, 3600)
block_limiter = RateLimiter(10, 3600)
grievance_limiter = RateLimiter(3, 3600)

async def enforce_report_limit(user: dict = Depends(auth_bearer)):
    if not report_limiter.is_allowed(user["id"]):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail="Sanctuary Protocol: Report frequency limit reached. Please wait."
        )

async def enforce_block_limit(user: dict = Depends(auth_bearer)):
    if not block_limiter.is_allowed(user["id"]):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail="Sanctuary Protocol: Block frequency limit reached."
        )

async def enforce_grievance_limit(user: dict = Depends(auth_bearer)):
    if not grievance_limiter.is_allowed(user["id"]):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail="Sanctuary Protocol: Grievance frequency limit reached."
        )

# --- 📋 Request Schemas ---
class ReportRequest(BaseModel):
    reported_id: str
    reason: str = Field(..., min_length=10, max_length=500)
    evidence_url: Optional[AnyHttpUrl] = None

class BlockRequest(BaseModel):
    blocked_id: str

class GrievanceRequest(BaseModel):
    subject: str = Field(..., min_length=5, max_length=100)
    description: str = Field(..., min_length=20, max_length=2000)

# --- 🚪 Endpoints ---
@router.post("/report", dependencies=[Depends(enforce_report_limit)])
async def submit_report(request: ReportRequest, user: dict = Depends(auth_bearer)):
    """Submits a report against a Registry identity. Gated by session and rate limits."""
    reporter_id = user["id"]
    
    # 1. Record the report
    report_id = f"rpt_{uuid.uuid4().hex[:8]}"
    evidence = str(request.evidence_url) if request.evidence_url else None
    
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, evidence_url) VALUES (?, ?, ?, ?, ?)",
        [report_id, reporter_id, request.reported_id, request.reason, evidence]
    )

    # 2. Check and Auto-Block if necessary (Shadowban threshold)
    await _check_and_auto_block(request.reported_id)

    return {"status": "submitted", "report_id": report_id, "audited": True}

async def _check_and_auto_block(target_id: str):
    """
    Automatically shadowbans users with high report frequency.
    Refined logic: Check reports only from the last 30 days to allow for behavioral recovery.
    """
    thirty_days_ago = (datetime.now() - timedelta(days=30)).isoformat()
    
    sql = "SELECT COUNT(*) as count FROM reports WHERE reported_id = ? AND created_at > ?"
    res = await turso_client.execute(sql, [target_id, thirty_days_ago])
    
    if not res.rows:
        return
        
    report_count = res.rows[0].get("count", 0)
    
    # Threshold: 3 unique reports in 30 days triggers automatic standing loss
    if report_count >= 3:
        # Heavily penalize rank score and flag for review
        # Standing reduction of 50%
        await turso_client.execute(
            "UPDATE profiles SET rank_score = rank_score * 0.5, onboarding_status = 'UNDER_REVIEW', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            [target_id]
        )

@router.post("/block", dependencies=[Depends(enforce_block_limit)])
async def block_user(request: BlockRequest, user: dict = Depends(auth_bearer)):
    """Mutually blocks discovery between two identities. Gated by session and rate limits."""
    blocker_id = user["id"]
    await turso_client.execute(
        "INSERT OR IGNORE INTO blocks (blocker_id, blocked_id) VALUES (?, ?)",
        [blocker_id, request.blocked_id]
    )
    return {"status": "blocked", "target": request.blocked_id}

@router.post("/grievance", dependencies=[Depends(enforce_grievance_limit)])
async def submit_grievance(request: GrievanceRequest, user: dict = Depends(auth_bearer)):
    """Submits a formal protocol grievance. Gated by session and rate limits."""
    user_id = user["id"]
    report_id = f"grv_{uuid.uuid4().hex[:8]}"
    await turso_client.execute(
        "INSERT INTO reports (id, reporter_id, reported_id, reason, status) VALUES (?, ?, ?, ?, 'grievance')",
        [report_id, user_id, "SYSTEM_ADMIN", f"{request.subject}: {request.description}"]
    )
    return {"status": "submitted", "grievance_id": report_id}
