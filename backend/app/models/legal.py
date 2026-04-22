from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid

class LegalDocumentVersion(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    document_type: str = Field(index=True) # 'tos', 'privacy', 'aadhaar_consent'
    version: str = Field(index=True)
    content_url: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ConsentLog(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID = Field(index=True)
    document_type: str
    version: str
    accepted_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Forensic Metadata
    ip_address: Optional[str] = Field(default=None)
    device_info: Optional[str] = Field(default=None)
