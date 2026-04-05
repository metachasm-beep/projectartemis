from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from app.models.legal import LegalDocumentVersion, ConsentLog
from app.db.supabase import supabase_client

router = APIRouter()

@router.get("/documents", response_model=List[LegalDocumentVersion])
async def get_legal_documents():
    """
    Returns the current active versions of all legal documents.
    Used by the frontend to ensure the correct version is logged in Consent.
    """
    response = supabase_client.table("legal_document_versions") \
        .select("*") \
        .eq("is_active", True) \
        .execute()
    return response.data

@router.post("/accept")
async def accept_document(consent: ConsentLog, request: Request):
    """
    Logs an explicit consent event with forensic metadata (IP/Device).
    Mandatory for DPDP 2023 proof of consent.
    """
    # Extract IP and append metadata
    ip = request.client.host if request.client else "unknown"
    
    consent_data = {
        "user_id": str(consent.user_id),
        "document_type": consent.document_type,
        "version": consent.version,
        "ip_address": ip,
        "device_info": consent.device_info or "unknown"
    }

    response = supabase_client.table("consent_logs").insert(consent_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to log consent status.")

    return {"status": "success", "message": f"Consent recorded for {consent.document_type} v{consent.version}"}
