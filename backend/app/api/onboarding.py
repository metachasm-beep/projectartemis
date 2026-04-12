from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from app.db.turso import turso_client
import json

router = APIRouter()

class OnboardingRequest(BaseModel):
    user_id: str
    date_of_birth: date
    analytics_accepted: bool = True
    ads_accepted: bool = True
    ranking_accepted: bool = True

def calculate_age(born: date):
    today = date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

@router.post("/verify-age")
async def verify_age(dob: date):
    """Early age verification for UX feedback."""
    age = calculate_age(dob)
    if age < 18:
        raise HTTPException(status_code=403, detail="Statutory Hard Block: You must be 18+ to enter Matriarch.")
    return {"status": "success", "age": age}

@router.post("/complete")
async def complete_onboarding(request: OnboardingRequest):
    """Finalizes Registry profile with age and consent."""
    age = calculate_age(request.date_of_birth)
    if age < 18:
        raise HTTPException(status_code=403, detail="Minors restricted per IT Rules 2021.")

    consent_payload = {
        "analytics_accepted": request.analytics_accepted,
        "ads_accepted": request.ads_accepted,
        "ranking_accepted": True
    }

    # Atomic Update in Turso
    await turso_client.execute(
        "UPDATE profiles SET date_of_birth = ?, data_processing_consent = ?, onboarding_status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        [request.date_of_birth.isoformat(), json.dumps(consent_payload), request.user_id]
    )

    return {
        "status": "success", 
        "message": "Sovereign Profile activated.",
        "age": age
    }
