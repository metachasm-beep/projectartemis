from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, AliasChoices
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "MATRIARCH"
    API_V1_STR: str = "/api/v1"

    # Supabase configuration
    SUPABASE_URL: str = Field("", validation_alias=AliasChoices("SUPABASE_URL", "VITE_SUPABASE_URL"))
    SUPABASE_ANON_KEY: str = Field("", validation_alias=AliasChoices("SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY"))
    SUPABASE_KEY: str = ""

    # Database Settings
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = "postgres"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: Optional[str] = None

    # Firebase configuration (Admin SDK)
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = None

    # Aadhaar/Identity Settings
    AADHAAR_MANDATORY: bool = True

    # Cloudinary configuration
    CLOUDINARY_CLOUD_NAME: Optional[str] = Field(None, validation_alias=AliasChoices("CLOUDINARY_CLOUD_NAME", "VITE_CLOUDINARY_CLOUD_NAME"))
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    # AI/Agentic Settings
    COHERE_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        case_sensitive=False, # Make it case-insensitive for better env matching
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
