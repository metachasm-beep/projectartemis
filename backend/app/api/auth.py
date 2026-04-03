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
    Verifies if a Matriarch invite code is valid and has uses remaining.
    """
    # Normalize code
    code = request.code.strip().upper()
    
    # Query the invite_codes table
    response = supabase_client.table("invite_codes") \
        .select("*, users!creator_id(profiles(full_name))") \
        .eq("code", code) \
        .execute()
    
    if not response.data:
        return {"valid": False, "message": "Invalid Matriarch code. Access denied."}
    
    invite = response.data[0]
    
    # Check expiry
    if invite.get("expires_at"):
        expires_at = datetime.fromisoformat(invite["expires_at"].replace('Z', '+00:00'))
        if expires_at < datetime.now(timezone.utc):
            return {"valid": False, "message": "This Matriarch code has expired."}
    
    # Check uses and is_used flag
    if invite.get("is_used") or invite["current_uses"] >= invite["max_uses"]:
        return {"valid": False, "message": "This Matriarch code has already been consumed."}
    
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
    Consumes a Matriarch invite code, marking it as used and linking it to a user.
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

    # 3. Update the user profile and award points
    # Referee (Joining user) gets 100 points
    supabase_client.table("profiles") \
        .update({
            "points": 100, 
            "referred_by_id": invite["creator_id"]
        }) \
        .eq("user_id", request.user_id) \
        .execute()

    # Referrer (Creator of the code) gets 100 points
    referrer_profile = supabase_client.table("profiles") \
        .select("points") \
        .eq("user_id", invite["creator_id"]) \
        .execute()
    
    if referrer_profile.data:
        new_points = (referrer_profile.data[0].get("points") or 0) + 100
        supabase_client.table("profiles") \
            .update({"points": new_points}) \
            .eq("user_id", invite["creator_id"]) \
            .execute()

    # 4. Record transactions for ledger
    supabase_client.table("point_transactions").insert([
        {"user_id": request.user_id, "delta": 100, "transaction_type": "registration_bonus", "notes": f"Joined via code {code}"},
        {"user_id": invite["creator_id"], "delta": 100, "transaction_type": "referral_credit", "notes": f"Referred user {request.user_id}"}
    ]).execute()

    # 5. Full Auth update
    supabase_client.table("users") \
        .update({"invite_code_used": code, "is_verified_Matriarch": True, "invited_by": invite["creator_id"]}) \
        .eq("id", request.user_id) \
        .execute()

    return {"status": "success", "message": "Matriarch access granted."}
