"""Configuration for DougHub2 application."""

import os
from pathlib import Path

# Database settings
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///doughub.db")

# Media storage settings
MEDIA_ROOT: str = os.getenv("MEDIA_ROOT", "media_root")

# Output directory for saved extractions
OUTPUT_DIR: Path = Path(os.getenv("OUTPUT_DIR", "extractions"))

# Notebook settings
NOTES_DIR: str = os.getenv(
    "NOTES_DIR", os.path.join(os.path.expanduser("~"), ".doughub", "notes")
)
