from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, constr
from app.services.aadhaar import aadhaar_service

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
        return result
    raise HTTPException(status_code=400, detail=result["error"])
