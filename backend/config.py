from pydantic_settings import BaseSettings
from functools import lru_cache
import json
import os


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

    @classmethod
    def settings_customise_sources(cls, settings_cls, init_settings, env_settings, dotenv_settings, file_settings, init_kwargs):
        """Custom source handling for CORS_ORIGINS to support JSON parsing from env"""
        if "CORS_ORIGINS" in env_settings:
            cors_value = env_settings["CORS_ORIGINS"]
            if isinstance(cors_value, str):
                try:
                    env_settings["CORS_ORIGINS"] = json.loads(cors_value)
                except json.JSONDecodeError:
                    env_settings["CORS_ORIGINS"] = [cors_value]
        return super().settings_customise_sources(settings_cls, init_settings, env_settings, dotenv_settings, file_settings, init_kwargs)


@lru_cache()
def get_settings():
    return Settings()
