from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, constr
from app.services.aadhaar import aadhaar_service
from app.db.turso import turso_client
from app.core.ranking import ranking_engine

router = APIRouter()

class AadhaarVerifyRequest(BaseModel):
    user_id: str
    aadhaar_number: constr(pattern=r"^\d{12}$")
    otp: constr(pattern=r"^\d{6}$")

class AadhaarOtpRequest(BaseModel):
    user_id: str
    aadhaar_number: constr(pattern=r"^\d{12}$")

@router.post("/otp/request")
async def request_aadhaar_otp(request: AadhaarOtpRequest):
    result = aadhaar_service.request_otp(request.aadhaar_number)
    if result["success"]:
        return result
    raise HTTPException(status_code=400, detail=result["error"])

@router.post("/verify")
async def verify_aadhaar(request: AadhaarVerifyRequest):
    result = aadhaar_service.verify_otp(request.user_id, request.aadhaar_number, request.otp)
    if result["success"]:
        # Update Turso with verification status
        data = result["data"]
        
        # 1. Update Profile
        await turso_client.execute(
            "UPDATE profiles SET aadhaar_verified = 1, full_name = ?, date_of_birth = ? WHERE user_id = ?",
            [data["full_name"], data["dob"], request.user_id]
        )
        
        # 2. Recalculate Rank (Single Source of Truth)
        # Fetch current profile to get completeness
        prof_res = await turso_client.execute("SELECT profile_completeness FROM profiles WHERE user_id = ?", [request.user_id])
        completeness = prof_res[0].get("profile_completeness", 0) if prof_res else 0
        
        # Calculate new score (base + verification bonus)
        new_score = ranking_engine.calculate_base_score(completeness, True)
        
        # Update score in DB
        await turso_client.execute(
            "UPDATE profiles SET rank_score = ? WHERE user_id = ?",
            [new_score, request.user_id]
        )
        
        tier = ranking_engine.get_tier_by_score(new_score)
        result["new_standing"] = {
            "score": new_score,
            "tier": tier.name
        }
        
        return result
    raise HTTPException(status_code=400, detail=result["error"])
