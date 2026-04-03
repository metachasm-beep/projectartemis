from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "MATRIARCH"
    API_V1_STR: str = "/api/v1"

    # Supabase configuration
    SUPABASE_URL: str = ""
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

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",  # allow DATABASE_URL and other extra env vars
    )


settings = Settings()
