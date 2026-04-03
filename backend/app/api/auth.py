from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.db.supabase import supabase_client
from datetime import datetime, timezone
import uuid

router = APIRouter()

class InviteVerifyRequest(BaseModel):
    code: str

class InviteVerifyResponse(BaseModel):
    valid: bool
    message: str
    creator_name: str | None = None

@router.post("/verify-invite", response_model=InviteVerifyResponse)
async def verify_invite(request: InviteVerifyRequest):
    """
    Verifies if a Sovereign invite code is valid and has uses remaining.
    """
    # Normalize code
    code = request.code.strip().upper()
    
    # Query the invite_codes table
    response = supabase_client.table("invite_codes") \
        .select("*, users!creator_id(profiles(full_name))") \
        .eq("code", code) \
        .execute()
    
    if not response.data:
        return {"valid": False, "message": "Invalid Sovereign code. Access denied."}
    
    invite = response.data[0]
    
    # Check expiry
    if invite.get("expires_at"):
        expires_at = datetime.fromisoformat(invite["expires_at"].replace('Z', '+00:00'))
        if expires_at < datetime.now(timezone.utc):
            return {"valid": False, "message": "This Sovereign code has expired."}
    
    # Check uses
    if invite["current_uses"] >= invite["max_uses"]:
        return {"valid": False, "message": "This code has reached its maximum usage limit."}
    
    creator_name = "A Matriarch Founder"
    try:
        # Extract creator name from join
        creator_name = invite["users"]["profiles"]["full_name"]
    except (KeyError, TypeError):
        pass

    return {
        "valid": True, 
        "message": f"Code verified. Invited by {creator_name}.",
        "creator_name": creator_name
    }
