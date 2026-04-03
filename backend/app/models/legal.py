from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class LegalDocumentVersion(SQLModel, table=True):
    __tablename__ = "legal_document_versions"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    document_type: str = Field(index=True) # 'tos', 'privacy', 'aadhaar_consent'
    version: str = Field(index=True)
    content_url: str
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ConsentLog(SQLModel, table=True):
    __tablename__ = "consent_logs"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(index=True)
    document_type: str
    version: str
    accepted_at: datetime = Field(default_factory=datetime.utcnow)
