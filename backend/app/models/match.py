from sqlmodel import SQLModel, Field
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


class Match(SQLModel, table=True):
    """Created ONLY when a woman selects a man. Asymmetric by design."""
    __tablename__ = "matches"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    woman_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    man_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    status: MatchStatus = Field(default=MatchStatus.active)

    # Communication is fully controlled by the woman
    comm_mode: CommunicationMode = Field(default=CommunicationMode.none_)
    comm_mode_set_at: Optional[datetime] = None
    comm_mode_unlocked: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SelectionEvent(SQLModel, table=True):
    """Records every woman action on a man profile (audit log)."""
    __tablename__ = "selection_events"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    woman_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    man_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    action: str  # "match", "skip", "save", "report", "block"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RankEvent(SQLModel, table=True):
    """Immutable ledger of all rank-affecting events."""
    __tablename__ = "rank_events"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    event_type: str   # "boost_purchase", "referral_credit", "ad_watch", "moderation_penalty"
    delta: float      # positive = rank up, negative = rank down
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
