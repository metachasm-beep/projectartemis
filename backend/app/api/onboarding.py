from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional
import uuid
from app.db.supabase import supabase_client

router = APIRouter()

class OnboardingRequest(BaseModel):
    user_id: uuid.UUID
    date_of_birth: date
    analytics_accepted: bool = True
    ads_accepted: bool = True
    ranking_accepted: bool = True # Disclosed as essential

def calculate_age(born: date):
    today = date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

@router.post("/verify-age")
async def verify_age(dob: date):
    """
    Stand-alone age verification for early UI feedback.
    """
    age = calculate_age(dob)
    if age < 18:
        raise HTTPException(status_code=403, detail="Statutory Hard Block: You must be 18+ to enter Matriarch.")
    return {"status": "success", "age": age}

@router.post("/complete")
async def complete_onboarding(request: OnboardingRequest):
    """
    Finalizes the user onboarding by saving DOB and Granular Consent.
    Mandatory step before entering the Matriarch ecosystem.
    """
    # 1. Hard Age Gate
    age = calculate_age(request.date_of_birth)
    if age < 18:
        raise HTTPException(
            status_code=403, 
            detail="Account activation failed. Minors are restricted from this platform per IT Rules 2021."
        )

    # 2. Prepare Data Processing JSONB
    consent_payload = {
        "analytics_accepted": request.analytics_accepted,
        "ads_accepted": request.ads_accepted,
        "ranking_accepted": True # Always true as it's the core functional mechanic
    }

    # 3. Update Profile
    update_data = {
        "date_of_birth": request.date_of_birth.isoformat(),
        "age": age,
        "data_processing_consent": consent_payload,
        "updated_at": datetime.utcnow().isoformat()
    }

    response = supabase_client.table("profiles") \
        .update(update_data) \
        .eq("user_id", str(request.user_id)) \
        .execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to persist onboarding data.")

    return {
        "status": "success", 
        "message": "Sovereign Profile activated. Welcome to Matriarch.",
        "age": age
    }
