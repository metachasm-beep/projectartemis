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
    
    # Check uses and is_used flag
    if invite.get("is_used") or invite["current_uses"] >= invite["max_uses"]:
        return {"valid": False, "message": "This Sovereign code has already been consumed."}
    
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

class ConsumeInviteRequest(BaseModel):
    code: str
    user_id: str

@router.post("/consume-invite")
async def consume_invite(request: ConsumeInviteRequest):
    """
    Consumes a Sovereign invite code, marking it as used and linking it to a user.
    """
    code = request.code.strip().upper()
    
    # 1. Fetch the invite
    response = supabase_client.table("invite_codes") \
        .select("*") \
        .eq("code", code) \
        .execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Invite code not found")
    
    invite = response.data[0]
    
    if invite.get("is_used") or invite["current_uses"] >= invite["max_uses"]:
         raise HTTPException(status_code=400, detail="Invite code already used")

    # 2. Update the invite code
    # If max_uses is 1, set is_used to true. Otherwise just increment.
    new_uses = invite["current_uses"] + 1
    update_data = {
        "current_uses": new_uses,
        "used_at": datetime.now(timezone.utc).isoformat(),
        "used_by_id": request.user_id
    }
    
    if invite["max_uses"] == 1 or new_uses >= invite["max_uses"]:
        update_data["is_used"] = True

    supabase_client.table("invite_codes") \
        .update(update_data) \
        .eq("code", code) \
        .execute()

    # 3. Update the user profile (optional but good for tracking)
    supabase_client.table("users") \
        .update({"invite_code_used": code, "is_verified_sovereign": True, "invited_by": invite["creator_id"]}) \
        .eq("id", request.user_id) \
        .execute()

    return {"status": "success", "message": "Sovereign access granted."}
