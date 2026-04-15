from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.security import auth_bearer
from datetime import datetime
import json
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

class InviteVerifyRequest(BaseModel):
    code: str

class ConsumeInviteRequest(BaseModel):
    code: str

# 🛡️ THE PROTOCOL: CIRCULAR LOOP PREVENTION (DAG)
async def verify_referral_integrity(referrer_id: str, referee_id: str):
    """
    Ensures the referral does not create a circular loop.
    Traverses the 'referred_by_id' chain to verify the referee is not an ancestor.
    """
    current_parent = referrer_id
    depth = 0
    MAX_DEPTH = 5 # Prevent infinite loops/depth attacks

    while current_parent and depth < MAX_DEPTH:
        if current_parent == referee_id:
            return False # Circular loop detected!
        
        # Fetch parent's referrer
        res = await turso_client.execute("SELECT referred_by_id FROM profiles WHERE user_id = ?", [current_parent])
        if res.rows:
            current_parent = res.rows[0]["referred_by_id"]
        else:
            break
        depth += 1
    
    return True

@router.post("/verify-invite")
async def verify_invite(request: InviteVerifyRequest):
    """Verifies a Matriarch invite code via the Registry lookup."""
    code = request.code.strip().upper()
    
    sql = """
    SELECT ic.*, p.full_name as creator_name 
    FROM invite_codes ic
    JOIN profiles p ON ic.creator_id = p.user_id
    WHERE ic.code = ?
    """
    res = await turso_client.execute(sql, [code])
    
    if not res.rows:
        return {"valid": False, "message": "Invalid Matriarch code. Access denied."}
    
    invite = res.rows[0]
    
    if invite.get("expires_at"):
        expires = datetime.fromisoformat(invite["expires_at"])
        if expires < datetime.now():
            return {"valid": False, "message": "This Matriarch code has expired."}
    
    if bool(invite["is_used"]) and invite["current_uses"] >= invite["max_uses"]:
        return {"valid": False, "message": "This Matriarch code has already been consumed."}
    
    return {
        "valid": True, 
        "message": f"Code verified. Invited by {invite['creator_name']}.",
        "creator_name": invite["creator_name"]
    }

@router.post("/consume-invite")
async def consume_invite(request: ConsumeInviteRequest, user: dict = Depends(auth_bearer)):
    """
    Consumes invite, awards Sanctuary points, and records the connection in the Referral Ledger.
    Enforces DAG integrity to prevent circular loops.
    """
    code = request.code.strip().upper()
    referee_id = user["id"]
    
    # 1. Fetch and Validate Invite
    res = await turso_client.execute("SELECT * FROM invite_codes WHERE code = ?", [code])
    if not res.rows:
        raise HTTPException(status_code=404, detail="Invite code not found")
    
    invite = res.rows[0]
    referrer_id = invite["creator_id"]

    if referrer_id == referee_id:
        raise HTTPException(status_code=400, detail="Self-referral protocols are not permitted.")

    if bool(invite["is_used"]) and invite["current_uses"] >= invite["max_uses"]:
         raise HTTPException(status_code=400, detail="Invite code has reached its consumption limit.")

    # 2. CIRCULAR LOOP PREVENTION (DAG CHECK)
    is_valid_chain = await verify_referral_integrity(referrer_id, referee_id)
    if not is_valid_chain:
        raise HTTPException(
            status_code=400, 
            detail="Circular referral loop detected. Protocol integrity check failed."
        )

    # 3. Process Usage and Award Points (Atomic Transaction)
    new_uses = invite["current_uses"] + 1
    is_fully_used = 1 if (invite["max_uses"] == 1 or new_uses >= invite["max_uses"]) else 0
    ledger_id = f"ref_ldgr_{uuid.uuid4().hex[:12]}"
    now = datetime.now().isoformat()

    try:
        # We use a batch for cross-table integrity
        # Note: In LibSQL/Turso, 'batch' handles the transaction.
        await turso_client.batch([
            # Update Invite Status
            f"UPDATE invite_codes SET current_uses = {new_uses}, is_used = {is_fully_used}, used_at = '{now}' WHERE code = '{code}'",
            # Update Profiles (Award 100 points each + link)
            f"UPDATE profiles SET points = points + 100, referred_by_id = '{referrer_id}' WHERE user_id = '{referee_id}'",
            f"UPDATE profiles SET points = points + 100 WHERE user_id = '{referrer_id}'",
            # Record in Standalone Referral Ledger
            f"INSERT INTO referral_ledger (id, referrer_id, referee_id, invite_code) VALUES ('{ledger_id}', '{referrer_id}', '{referee_id}', '{code}')",
            # Log Transactions
            f"INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES ('tx_reg_{uuid.uuid4().hex[:8]}', '{referee_id}', 100, 'registration_bonus', 'Code {code}')",
            f"INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES ('tx_ref_{uuid.uuid4().hex[:8]}', '{referrer_id}', 100, 'referral_credit', 'Invited {referee_id}')"
        ])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sanctuary Ledger sync failed: {str(e)}")

    return {
        "status": "success", 
        "message": "Invite consumed. Resonance points credited to both identities.",
        "referrer": referrer_id
    }
