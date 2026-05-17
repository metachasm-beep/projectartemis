from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, constr
from app.services.aadhaar import aadhaar_service
from app.db.turso import turso_client
from app.core.ranking import ranking_engine
from app.core.security import auth_bearer
import hashlib
import hmac

router = APIRouter(prefix="/verification", tags=["verification"])

class AadhaarVerifyRequest(BaseModel):
    aadhaar_number: constr(pattern=r"^\d{12}$")
    otp: constr(pattern=r"^\d{6}$")

class AadhaarOtpRequest(BaseModel):
    aadhaar_number: constr(pattern=r"^\d{12}$")

@router.post("/otp/request")
async def request_aadhaar_otp(request: AadhaarOtpRequest, user: dict = Depends(auth_bearer)):
    """Initiates Aadhaar OTP request for the authenticated user."""
    result = aadhaar_service.request_otp(request.aadhaar_number)
    if result["success"]:
        return result
    raise HTTPException(status_code=400, detail=result["error"])

@router.post("/verify")
async def verify_aadhaar(request: AadhaarVerifyRequest, user: dict = Depends(auth_bearer)):
    """
    Verifies Aadhaar OTP and updates the Registry.
    Gated by JWT to ensure the verified identity matches the logged-in session.
    """
    user_id = user["id"]
    result = aadhaar_service.verify_otp(user_id, request.aadhaar_number, request.otp)
    
    if result["success"]:
        data = result["data"]
        
        # 1. Update Profile (Identity Sealing)
        await turso_client.execute(
            "UPDATE profiles SET aadhaar_verified = 1, full_name = ?, date_of_birth = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            [data["full_name"], data["dob"], user_id]
        )
        
        # 2. Recalculate Rank via Standing Protocol
        prof_res = await turso_client.execute("SELECT profile_completeness FROM profiles WHERE user_id = ?", [user_id])
        completeness = prof_res.rows[0].get("profile_completeness", 0) if prof_res.rows else 0
        
        new_score = ranking_engine.calculate_base_score(completeness, True)
        
        await turso_client.execute(
            "UPDATE profiles SET rank_score = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            [new_score, user_id]
        )
        
        tier = ranking_engine.get_tier_by_score(new_score)
        return {
            "success": True,
            "message": "Identity sealed in Registry.",
            "new_standing": {
                "score": new_score,
                "tier": tier.name
            }
        }
    
    raise HTTPException(status_code=400, detail=result["error"])

class FinalizeRequest(BaseModel):
    status: str = "Approved"

@router.post("/finalize")
async def finalize_verification(request: FinalizeRequest, user: dict = Depends(auth_bearer)):
    """
    🛡️ PROTOCOL V2.5: FINAL IDENTITY SEALING / REJECTION
    Marks the user as verified (1) or unverified (0) in the Sanctuary Registry based on Didit result.
    """
    user_id = user["id"]
    
    try:
        is_verified_val = 1 if request.status == "Approved" else 0
        audit_status = "SUCCESS" if request.status == "Approved" else "FAILED"
        
        audit_id = f"audit_{user_id}_{hashlib.md5(user_id.encode()).hexdigest()[:8]}"
        
        await turso_client.batch([
            ("UPDATE profiles SET is_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [is_verified_val, user_id]),
            ("INSERT INTO protocol_audits (id, user_id, action, status, created_at) VALUES (?, ?, 'IDENTITY_SEALING', ?, CURRENT_TIMESTAMP)", 
             [audit_id, user_id, audit_status])
        ])
        
        return {
            "success": True,
            "message": "Identity sealed. Sanctuary access granted." if is_verified_val == 1 else "Identity verification failed. Marked as unverified.",
            "status": "VERIFIED" if is_verified_val == 1 else "UNVERIFIED"
        }
    except Exception as e:
        print(f"❌ FINALIZATION_FAILURE: {e}")
        raise HTTPException(status_code=500, detail="Identity sealing failed.")
