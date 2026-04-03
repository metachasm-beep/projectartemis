from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.legal import LegalDocumentVersion, ConsentLog
# from app.core.deps import get_db # Placeholder for DB dependency

router = APIRouter()

@router.get("/documents", response_model=List[LegalDocumentVersion])
async def get_legal_documents():
    # Placeholder: Fetch from DB in real implementation
    return [
        {
            "document_type": "tos",
            "version": "2026.04.01",
            "content_url": "https://matriarch.app/legal/tos",
            "is_active": True
        },
        {
            "document_type": "privacy",
            "version": "2026.04.01",
            "content_url": "https://matriarch.app/legal/privacy",
            "is_active": True
        },
        {
            "document_type": "aadhaar_consent",
            "version": "1.0.0",
            "content_url": "https://matriarch.app/legal/aadhaar",
            "is_active": True
        }
    ]

@router.post("/accept")
async def accept_document(consent: ConsentLog):
    # Placeholder: Save to DB in real implementation
    return {"status": "success", "message": f"Consent recorded for {consent.document_type} v{consent.version}"}
