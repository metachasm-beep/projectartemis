from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid
from enum import Enum


class MatchStatus(str, Enum):
    active = "active"
    unmatched = "unmatched"


class CommunicationMode(str, Enum):
    none_ = "none"
    chat = "chat"
    voice_request = "voice_request"
    video_request = "video_request"
    delayed_unlock = "delayed_unlock"
    qa_mode = "qa_mode"
    prompt_intro = "prompt_intro"


class Match(BaseModel):
    """Created ONLY when a woman selects a man. Asymmetric by design."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    woman_id: uuid.UUID = Field(index=True)
    man_id: uuid.UUID = Field(index=True)
    status: MatchStatus = Field(default=MatchStatus.active)

    # Communication is fully controlled by the woman
    comm_mode: CommunicationMode = Field(default=CommunicationMode.none_)
    comm_mode_set_at: Optional[datetime] = None
    comm_mode_unlocked: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SelectionEvent(BaseModel):
    """Records every woman action on a man profile (audit log)."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    woman_id: uuid.UUID = Field(index=True)
    man_id: uuid.UUID = Field(index=True)
    action: str  # "match", "skip", "save", "report", "block"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RankEvent(BaseModel):
    """Immutable ledger of all rank-affecting events."""
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID = Field(index=True)
    event_type: str   # "boost_purchase", "referral_credit", "ad_watch", "moderation_penalty"
    delta: float      # positive = rank up, negative = rank down
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
