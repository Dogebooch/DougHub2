"""Configuration for DougHub2 application."""

import os
from pathlib import Path

# Database settings
DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///doughub.db")

# Data directory structure:
#   data/
#     extractions/         <- saved question extractions (organized by source/year/month)
#       media/             <- downloaded images from extractions

# Media storage settings (under extractions)
MEDIA_ROOT: str = os.getenv("MEDIA_ROOT", "data/extractions/media")

# Output directory for saved extractions
OUTPUT_DIR: Path = Path(os.getenv("OUTPUT_DIR", "data/extractions"))

# Notebook settings
NOTES_DIR: str = os.getenv(
    "NOTES_DIR", os.path.join(os.path.expanduser("~"), ".doughub", "notes")
)
