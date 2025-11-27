"""Configuration for DougHub2 application using Pydantic Settings."""

import os
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support.

    Settings can be overridden via environment variables or .env file.
    For example, set EXTRACTION_DIR environment variable to change
    the extraction output directory.
    """

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # Database settings
    DATABASE_URL: str = "sqlite:///doughub.db"

    # Directory for saving extractions (organized by source/year/month)
    EXTRACTION_DIR: Path = Path("data/extractions")

    # Media storage settings (under extractions)
    MEDIA_ROOT: str = "data/extractions/media"

    # Notebook settings
    NOTES_DIR: str = os.path.join(os.path.expanduser("~"), ".doughub", "notes")


# Global settings instance
settings = Settings()

# Backward compatibility aliases - these use the settings instance
DATABASE_URL: str = settings.DATABASE_URL
OUTPUT_DIR: Path = settings.EXTRACTION_DIR
MEDIA_ROOT: str = settings.MEDIA_ROOT
NOTES_DIR: str = settings.NOTES_DIR
