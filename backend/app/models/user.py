from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, date
from typing import Optional, List
import uuid
from enum import Enum


class UserRole(str, Enum):
    woman = "woman"
    man = "man"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    phone: str = Field(unique=True, index=True)
    email: Optional[str] = Field(default=None, unique=True)
    role: UserRole
    firebase_uid: Optional[str] = Field(default=None, unique=True)
    is_active: bool = Field(default=True)
    is_banned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Sovereign Invite-Only Flow
    invite_code_used: Optional[str] = Field(default=None, index=True)
    is_verified_sovereign: bool = Field(default=False)
    invited_by: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")


class Profile(SQLModel, table=True):
    __tablename__ = "profiles"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True, index=True)
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    date_of_birth: Optional[date] = None
    age: Optional[int] = None          # computed from dob for filtering
    city: Optional[str] = None
    state: Optional[str] = None
    country: str = Field(default="IN")

    # Aadhaar verification fields
    aadhaar_verified: bool = Field(default=False)
    aadhaar_last_4: Optional[str] = None
    aadhaar_verification_id: Optional[str] = None
    aadhaar_verified_at: Optional[datetime] = None

    # Profile completeness (0-100)
    completeness_score: int = Field(default=0)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class MaleRankProfile(SQLModel, table=True):
    """Exists only for men — tracks their visibility ranking."""
    __tablename__ = "male_rank_profiles"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True, index=True)

    # Rank components
    rank_score: float = Field(default=0.0)
    profile_completeness_weight: float = Field(default=0.0)
    verification_bonus: float = Field(default=0.0)
    referral_bonus: float = Field(default=0.0)
    ad_watch_bonus: float = Field(default=0.0)
    paid_boost_bonus: float = Field(default=0.0)
    moderation_penalty: float = Field(default=0.0)
    inactivity_penalty: float = Field(default=0.0)

    # Caps / anti-abuse
    daily_ad_credits_used: int = Field(default=0)
    last_ad_credit_reset: Optional[datetime] = None
    boost_active_until: Optional[datetime] = None

    is_visible: bool = Field(default=True)
    is_shadowbanned: bool = Field(default=False)

    updated_at: datetime = Field(default_factory=datetime.utcnow)


class FemalePreferences(SQLModel, table=True):
    __tablename__ = "female_preferences"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", unique=True, index=True)

    min_age: int = Field(default=18)
    max_age: int = Field(default=50)
    max_distance_km: int = Field(default=50)
    aadhaar_verified_only: bool = Field(default=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class InviteCode(SQLModel, table=True):
    __tablename__ = "invite_codes"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    code: str = Field(unique=True, index=True)
    creator_id: uuid.UUID = Field(foreign_key="users.id")
    is_used: bool = Field(default=False)
    used_by_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    used_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    max_uses: int = Field(default=1)
    current_uses: int = Field(default=0)
