from pydantic_settings import BaseSettings
from functools import lru_cache
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./learnconnect.db"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # API Keys
    YOUTUBE_API_KEY: str = ""
    BING_SEARCH_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True

    def __init__(self, **data):
        super().__init__(**data)
        if isinstance(self.CORS_ORIGINS, str):
            try:
                self.CORS_ORIGINS = json.loads(self.CORS_ORIGINS)
            except (json.JSONDecodeError, TypeError):
                self.CORS_ORIGINS = ["http://localhost:5173", "http://localhost:3000"]


@lru_cache()
def get_settings():
    return Settings()
