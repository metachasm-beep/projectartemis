from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "MATRIARCH"
    API_V1_STR: str = "/api/v1"

    # Supabase configuration
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    # Alias for code that uses SUPABASE_KEY
    @property
    def SUPABASE_KEY(self) -> str:
        return self.SUPABASE_ANON_KEY

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

    # Cloudinary configuration (support both prefixed and non-prefixed)
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    VITE_CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    @property
    def cloudinary_cloud_name(self) -> Optional[str]:
        return self.CLOUDINARY_CLOUD_NAME or self.VITE_CLOUDINARY_CLOUD_NAME

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore",  # allow DATABASE_URL and other extra env vars
    )


settings = Settings()
