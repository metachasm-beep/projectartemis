from fastapi import APIRouter, HTTPException, Depends, Request
from typing import List
from app.db.turso import turso_client
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class LegalDoc(BaseModel):
    id: str
    document_type: str
    version: str
    content: str
    is_active: bool

class ConsentRequest(BaseModel):
    user_id: str
    document_type: str
    version: str
    device_info: str | None = None

@router.get("/documents", response_model=List[LegalDoc])
async def get_legal_documents():
    """Fetches active legal document versions from the Registry."""
    docs = await turso_client.execute("SELECT * FROM legal_document_versions WHERE is_active = 1")
    return docs

@router.post("/accept")
async def accept_document(consent: ConsentRequest, request: Request):
    """Logs explicit Sanctuary consent for compliance."""
    ip = request.client.host if request.client else "unknown"
    
    consent_id = f"con_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO consent_logs (id, user_id, document_type, version, ip_address, device_info) VALUES (?, ?, ?, ?, ?, ?)",
        [consent_id, consent.user_id, consent.document_type, consent.version, ip, consent.device_info or "unknown"]
    )
    
    return {"status": "success", "message": f"Consent recorded for {consent.document_type} v{consent.version}"}
