from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from app.db.turso import turso_client
from app.core.security import auth_bearer
import json

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

class OnboardingRequest(BaseModel):
    date_of_birth: date
    analytics_accepted: bool = True
    ads_accepted: bool = True
    ranking_accepted: bool = True

def calculate_age(born: date):
    today = date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

@router.post("/verify-age")
async def verify_age(dob: date):
    """Early age verification for UX feedback. Publicly accessible."""
    age = calculate_age(dob)
    if age < 18:
        raise HTTPException(status_code=403, detail="Statutory Hard Block: You must be 18+ to enter Matriarch.")
    return {"status": "success", "age": age}

@router.post("/complete")
async def complete_onboarding(request: OnboardingRequest, user: dict = Depends(auth_bearer)):
    """
    Finalizes Registry profile with age and consent. 
    Gated by JWT to prevent identity hijacking during the activation phase.
    """
    user_id = user["id"]
    age = calculate_age(request.date_of_birth)
    
    if age < 18:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Minors restricted per IT Rules 2021 and Matriarch Protocol safety standards."
        )

    consent_payload = {
        "analytics_accepted": request.analytics_accepted,
        "ads_accepted": request.ads_accepted,
        "ranking_accepted": True,
        "accepted_at": datetime.now().isoformat()
    }

    # Atomic Update in Turso Registry
    try:
        await turso_client.execute(
            "UPDATE profiles SET date_of_birth = ?, data_processing_consent = ?, onboarding_status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            [request.date_of_birth.isoformat(), json.dumps(consent_payload), user_id]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registry activation failed: {str(e)}")

    return {
        "status": "success", 
        "message": "Sovereign Profile activated in the Registry.",
        "age": age,
        "user_id": user_id
    }
