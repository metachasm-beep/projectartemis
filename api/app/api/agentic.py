from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.core.security import auth_bearer
from app.db.turso import turso_client
import uuid
import json
from datetime import datetime

router = APIRouter(prefix="/agentic", tags=["superpowers"])

class BrainstormRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class Skill(BaseModel):
    id: str
    label: str
    level: int
    mastery_pct: float
    description: str

# 1. AI Sanctuary Architect (Brainstorming)
@router.post("/brainstorm")
async def brainstorm_sanctuary(req: BrainstormRequest, user: dict = Depends(auth_bearer)):
    """
    Socratic AI brainstorming for profile/sanctuary design.
    In a production app, this would call an LLM.
    Here we implement the state management for the 'Brainstorming' skill.
    """
    user_id = user["id"]
    
    # Check if session exists or create new
    session_id = req.session_id or str(uuid.uuid4())
    
    # Logic: Log the brainstorm interaction and return the next 'Socratic' question
    # This simulates the 'brainstorming' skill from Superpowers.
    
    # Mocking AI response logic
    questions = [
        "What is the primary emotional resonance you want your Sanctuary to project?",
        "If your personality was a high-fashion architectural style, what would it be?",
        "What are the three non-negotiable boundaries you set for your digital peace?",
        "How should your 'Aura' score reflect your real-world contributions?"
    ]
    
    # Simple state tracking via Turso
    await turso_client.execute(
        "UPDATE profiles SET active_brainstorm_id = ? WHERE user_id = ?",
        [session_id, user_id]
    )
    
    return {
        "session_id": session_id,
        "reply": questions[0], # In reality, dynamic based on 'message'
        "plan_preview": "Drafting Sanctuary architecture..."
    }

# 2. The Playbook (Skills Registry)
@router.get("/playbook/skills", response_model=List[Skill])
async def get_user_skills(user: dict = Depends(auth_bearer)):
    """Retrieves the user's mastered skills from the Playbook."""
    res = await turso_client.execute(
        "SELECT skills FROM profiles WHERE user_id = ?",
        [user["id"]]
    )
    
    if not res.rows:
        return []
    
    skills_json = res.rows[0]["skills"] or "[]"
    return json.loads(skills_json)

@router.post("/playbook/level-up")
async def level_up_skill(skill_id: str, user: dict = Depends(auth_bearer)):
    """Simulates leveling up a skill based on user actions."""
    user_id = user["id"]
    res = await turso_client.execute("SELECT skills FROM profiles WHERE user_id = ?", [user_id])
    skills = json.loads(res.rows[0]["skills"] or "[]")
    
    # Update or add skill
    found = False
    for s in skills:
        if s["id"] == skill_id:
            s["level"] += 1
            s["mastery_pct"] = min(100.0, s["mastery_pct"] + 15.0)
            found = True
            break
            
    if not found:
        skills.append({
            "id": skill_id,
            "label": skill_id.replace("-", " ").title(),
            "level": 1,
            "mastery_pct": 10.0,
            "description": f"Mastery of the {skill_id} protocol."
        })
        
    await turso_client.execute(
        "UPDATE profiles SET skills = ? WHERE user_id = ?",
        [json.dumps(skills), user_id]
    )
    
    return {"status": "success", "skills": skills}

# 3. Verification Implementation Plan
@router.get("/verification/plan")
async def get_verification_plan(user: dict = Depends(auth_bearer)):
    """Retrieves the live implementation plan for the user's identity sealing."""
    user_id = user["id"]
    res = await turso_client.execute(
        "SELECT * FROM verification_plans WHERE user_id = ? AND status != 'SEALED' ORDER BY updated_at DESC LIMIT 1",
        [user_id]
    )
    
    if not res.rows:
        # Create a default plan if none exists
        plan_id = str(uuid.uuid4())
        steps = [
            {"id": "DOC_UPLOAD", "label": "Aadhaar Handshake", "status": "PENDING", "detail": "Waiting for document upload."},
            {"id": "BIOMETRIC", "label": "Biometric Sealing", "status": "PENDING", "detail": "Face Liveness verification required."},
            {"id": "REGISTRY_SYNC", "label": "Registry Sync", "status": "PENDING", "detail": "Finalizing Sanctuary record."},
        ]
        await turso_client.execute(
            "INSERT INTO verification_plans (id, user_id, steps, current_step_id) VALUES (?, ?, ?, ?)",
            [plan_id, user_id, json.dumps(steps), "DOC_UPLOAD"]
        )
        return {"id": plan_id, "steps": steps, "current_step": "DOC_UPLOAD"}
        
    plan = res.rows[0]
    return {
        "id": plan["id"],
        "steps": json.loads(plan["steps"]),
        "current_step": plan["current_step_id"],
        "status": plan["status"]
    }
