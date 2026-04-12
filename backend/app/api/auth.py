from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.db.turso import turso_client
from datetime import datetime
import json

router = APIRouter()

class InviteVerifyRequest(BaseModel):
    code: str

class InviteVerifyResponse(BaseModel):
    valid: bool
    message: str
    creator_name: str | None = None

@router.post("/verify-invite", response_model=InviteVerifyResponse)
async def verify_invite(request: InviteVerifyRequest):
    """Verifies a Matriarch invite code via Turso."""
    code = request.code.strip().upper()
    
    # 1. Fetch code and join creator name
    sql = """
    SELECT ic.*, p.full_name as creator_name 
    FROM invite_codes ic
    JOIN profiles p ON ic.creator_id = p.user_id
    WHERE ic.code = ?
    """
    res = await turso_client.execute(sql, [code])
    
    if not res:
        return {"valid": False, "message": "Invalid Matriarch code. Access denied."}
    
    invite = res[0]
    
    # 2. Expiry check
    if invite.get("expires_at"):
        expires = datetime.fromisoformat(invite["expires_at"])
        if expires < datetime.now():
            return {"valid": False, "message": "This Matriarch code has expired."}
    
    # 3. Usage check
    if bool(invite["is_used"]) or invite["current_uses"] >= invite["max_uses"]:
        return {"valid": False, "message": "This Matriarch code has already been consumed."}
    
    return {
        "valid": True, 
        "message": f"Code verified. Invited by {invite['creator_name']}.",
        "creator_name": invite["creator_name"]
    }

class ConsumeInviteRequest(BaseModel):
    code: str
    user_id: str

@router.post("/consume-invite")
async def consume_invite(request: ConsumeInviteRequest):
    """Consumes invite and awards Sanctuary points in the Turso ledger."""
    code = request.code.strip().upper()
    
    # 1. Fetch Invite
    res = await turso_client.execute("SELECT * FROM invite_codes WHERE code = ?", [code])
    if not res:
        raise HTTPException(status_code=404, detail="Invite code not found")
    
    invite = res[0]
    if bool(invite["is_used"]) or invite["current_uses"] >= invite["max_uses"]:
         raise HTTPException(status_code=400, detail="Invite code already used")

    # 2. Process Usage
    new_uses = invite["current_uses"] + 1
    is_fully_used = 1 if (invite["max_uses"] == 1 or new_uses >= invite["max_uses"]) else 0
    
    await turso_client.execute(
        "UPDATE invite_codes SET current_uses = ?, is_used = ?, used_at = CURRENT_TIMESTAMP, used_by_id = ? WHERE code = ?",
        [new_uses, is_fully_used, request.user_id, code]
    )

    # 3. Award Points (Atomic update logic)
    # Joining user gets 100
    await turso_client.execute(
        "UPDATE profiles SET points = points + 100, referred_by_id = ? WHERE user_id = ?",
        [invite["creator_id"], request.user_id]
    )
    
    # Creator gets 100
    await turso_client.execute(
        "UPDATE profiles SET points = points + 100 WHERE user_id = ?",
        [invite["creator_id"]]
    )

    # 4. Record Ledger Transactions
    await turso_client.execute(
        "INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES (?, ?, ?, ?, ?)",
        [f"reg_{int(datetime.now().timestamp())}", request.user_id, 100, "registration_bonus", f"Code {code}"]
    )
    await turso_client.execute(
        "INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES (?, ?, ?, ?, ?)",
        [f"ref_{int(datetime.now().timestamp())}", invite["creator_id"], 100, "referral_credit", f"Invited {request.user_id}"]
    )

    return {"status": "success", "message": "Matriarch access granted via Registry ledger."}
