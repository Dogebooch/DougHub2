"""
Extraction API Router.

This module provides endpoints for the question extraction feature,
allowing the Tampermonkey userscript to submit extracted page data.
"""

import json
import logging
import shutil
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any, Generator

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from doughub2 import config
from doughub2.models import Base
from doughub2.persistence import QuestionRepository

logger = logging.getLogger(__name__)

router = APIRouter(tags=["extraction"])

# Store extractions for review (in-memory)
extractions: list[dict[str, Any]] = []

# Database engine (lazy initialization)
_engine = None
_SessionLocal = None


def get_engine():
    """Get or create the database engine."""
    global _engine
    if _engine is None:
        _engine = create_engine(config.DATABASE_URL)
        Base.metadata.create_all(_engine)
    return _engine


def get_session_local():
    """Get or create the session factory."""
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(bind=get_engine())
    return _SessionLocal


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for database sessions."""
    SessionLocal = get_session_local()
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


# Pydantic models for request/response
class ImageInfo(BaseModel):
    """Information about an image in the extraction."""

    url: str | None = None
    title: str | None = None
    type: str | None = None


class ExtractionRequest(BaseModel):
    """Request model for the extraction endpoint."""

    timestamp: str | None = None
    url: str
    hostname: str | None = None
    siteName: str | None = None
    elementCount: int | None = None
    imageCount: int | None = None
    pageHTML: str | None = None
    bodyText: str | None = None
    elements: list[dict[str, Any]] | None = None
    images: list[ImageInfo] | None = None


class FileInfo(BaseModel):
    """Information about saved files."""

    html: str
    json_file: str
    images: list[str]


class DatabaseInfo(BaseModel):
    """Information about database persistence."""

    persisted: bool
    error: str | None = None


class ExtractionResponse(BaseModel):
    """Response model for the extraction endpoint."""

    status: str
    message: str
    extraction_count: int
    files: FileInfo
    database: DatabaseInfo


def parse_source_and_key(data: dict[str, Any], base_filename: str) -> tuple[str, str]:
    """Extract source name and question key from extraction data.

    Args:
        data: Extraction data dictionary
        base_filename: Generated base filename

    Returns:
        Tuple of (source_name, question_key)
    """
    # Get site name from the extraction data
    site_name = data.get("siteName", "unknown").replace(" ", "_")

    # Extract question key from the URL or use the extraction index
    url = data.get("url", "")

    parts = url.rstrip("/").split("/")
    if parts and len(parts) > 0:
        # Always use the last part of the URL as the question key
        question_key = parts[-1]
        # If it's empty or looks like a session ID (very long alphanumeric),
        # try the second-to-last part
        if not question_key or len(question_key) > 50:
            question_key = parts[-2] if len(parts) > 1 else base_filename.split("_")[-1]
    else:
        # Fallback: use the extraction index from base_filename
        question_key = base_filename.split("_")[-1]

    return site_name, question_key


def copy_image_to_media_root(
    source_path: Path, source_name: str, question_key: str, img_index: int
) -> str:
    """Copy an image file to the media storage directory.

    Args:
        source_path: Path to the source image file in extractions/
        source_name: Name of the source
        question_key: Question key
        img_index: Index of the image

    Returns:
        Relative path to the copied file
    """
    source_path = Path(source_path)
    media_root = Path(config.MEDIA_ROOT)

    # Create source-specific directory
    source_dir = media_root / source_name
    source_dir.mkdir(parents=True, exist_ok=True)

    # Create destination filename
    ext = source_path.suffix
    dest_filename = f"{question_key}_img{img_index}{ext}"
    dest_path = source_dir / dest_filename

    # Copy file if source exists
    if source_path.exists():
        shutil.copy2(source_path, dest_path)
        logger.info(f"Copied to media_root: {source_name}/{dest_filename}")

    # Return relative path
    return f"{source_name}/{dest_filename}"


def download_images(
    images: list[ImageInfo], base_filename: str, output_dir: Path
) -> list[dict[str, Any]]:
    """Download images from URLs and save locally.

    Args:
        images: List of ImageInfo objects with url, title, etc.
        base_filename: Base filename for saving (without extension)
        output_dir: Directory to save images to

    Returns:
        List of dictionaries with local paths and metadata
    """
    downloaded = []

    for idx, img in enumerate(images):
        try:
            url = img.url
            if not url:
                continue

            # Parse URL to get file extension
            parsed = urllib.parse.urlparse(url)
            path = parsed.path
            ext = Path(path).suffix or ".jpg"  # Default to .jpg if no extension

            # Generate filename
            img_filename = f"{base_filename}_img{idx}{ext}"
            img_path = output_dir / img_filename

            # Download the image
            logger.info(f"Downloading image {idx + 1}/{len(images)}: {url}")
            urllib.request.urlretrieve(url, img_path)

            downloaded.append(
                {
                    "index": idx,
                    "url": url,
                    "local_path": str(img_path),
                    "filename": img_filename,
                    "title": img.title or "",
                    "type": img.type or "image",
                }
            )

            logger.info(f"Saved: {img_filename}")

        except Exception as e:
            logger.warning(f"Failed to download image {idx}: {e}")
            downloaded.append(
                {"index": idx, "url": img.url if img.url else "", "error": str(e)}
            )

    return downloaded


def persist_to_database(
    data: dict[str, Any],
    html_file: Path,
    json_file: Path,
    downloaded_images: list[dict[str, Any]],
    base_filename: str,
    session: Session,
) -> tuple[bool, str | None]:
    """Persist the extraction to the database.

    Args:
        data: Extraction data dictionary
        html_file: Path to saved HTML file
        json_file: Path to saved JSON file
        downloaded_images: List of downloaded image metadata
        base_filename: Base filename for the extraction
        session: Database session

    Returns:
        Tuple of (success: bool, error_message: str or None)
    """
    try:
        repo = QuestionRepository(session)

        # Parse source name and question key
        source_name, question_key = parse_source_and_key(data, base_filename)

        logger.info(f"Persisting: {source_name}/{question_key}")

        # Get or create source
        source = repo.get_or_create_source(name=source_name)
        source_id: int = source.source_id  # type: ignore

        # Check if question already exists
        existing_question = repo.get_question_by_source_key(source_id, question_key)
        if existing_question:
            logger.info(
                f"Question already exists in database: {source_name}/{question_key}"
            )
            repo.commit()
            return True, None

        # Read HTML content
        html_content = html_file.read_text(encoding="utf-8")

        # Prepare metadata JSON
        with open(json_file, encoding="utf-8") as f:
            metadata = json.load(f)

        # Create question data
        question_data = {
            "source_id": source_id,
            "source_question_key": question_key,
            "raw_html": html_content,
            "raw_metadata_json": json.dumps(metadata),
            "status": "extracted",
            "extraction_path": str(json_file.parent / json_file.stem),
        }

        # Add question to database
        question = repo.add_question(question_data)
        question_id: int = question.question_id  # type: ignore
        logger.info(f"Added question to database (ID: {question_id})")

        # Process and persist media files
        for img_info in downloaded_images:
            if "local_path" not in img_info:
                continue

            local_path = Path(img_info["local_path"])
            if not local_path.exists():
                logger.warning(f"Image file not found: {local_path}")
                continue

            # Copy image to media_root
            relative_path = copy_image_to_media_root(
                local_path, source_name, question_key, img_info["index"]
            )

            # Determine MIME type from extension
            ext = local_path.suffix.lower()
            mime_types = {
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".gif": "image/gif",
                ".webp": "image/webp",
            }
            mime_type = mime_types.get(ext, "application/octet-stream")

            # Add media record
            media_data = {
                "media_role": "image",
                "media_type": "question_image",
                "mime_type": mime_type,
                "relative_path": relative_path,
            }
            media = repo.add_media_to_question(question_id, media_data)
            media_id: int = media.media_id  # type: ignore
            logger.info(f"Added media (ID: {media_id}): {relative_path}")

        # Commit the transaction
        repo.commit()
        logger.info("Successfully persisted to database")
        return True, None

    except Exception as e:
        session.rollback()
        error_msg = f"Database persistence failed: {e}"
        logger.error(error_msg)
        return False, error_msg


@router.post("/extract", response_model=ExtractionResponse)
async def extract(
    request: ExtractionRequest, db: Session = Depends(get_db)
) -> ExtractionResponse:
    """
    Receive and persist extracted page data from Tampermonkey script.

    This endpoint receives HTML content and metadata from the browser extension,
    saves the files locally, downloads any images, and persists everything
    to the database.

    Args:
        request: The extraction request containing page data.
        db: Database session (injected).

    Returns:
        ExtractionResponse with status and file information.
    """
    try:
        data = request.model_dump()

        # Store the extraction
        extractions.append(data)
        extraction_index = len(extractions) - 1

        # Create output directory
        output_dir = config.OUTPUT_DIR
        output_dir.mkdir(parents=True, exist_ok=True)

        # Ensure media root exists
        Path(config.MEDIA_ROOT).mkdir(parents=True, exist_ok=True)

        # Generate filename based on timestamp and site
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        site_name_raw = data.get("siteName") or "unknown"
        site_name = site_name_raw.replace(" ", "_")
        base_filename = f"{timestamp}_{site_name}_{extraction_index}"

        # Save HTML to file
        html_file = output_dir / f"{base_filename}.html"
        html_content = data.get("pageHTML") or ""
        html_file.write_text(html_content, encoding="utf-8")

        # Download images if present
        downloaded_images: list[dict[str, Any]] = []
        images = request.images or []
        if images:
            logger.info(f"Downloading {len(images)} image(s)...")
            downloaded_images = download_images(images, base_filename, output_dir)

        # Save JSON metadata (without the full HTML to keep it readable)
        json_data = {
            "timestamp": data.get("timestamp"),
            "url": data.get("url"),
            "hostname": data.get("hostname"),
            "siteName": data.get("siteName"),
            "elementCount": data.get("elementCount"),
            "imageCount": data.get("imageCount", 0),
            "bodyText": data.get("bodyText"),
            "elements": data.get("elements", []),
            "images": downloaded_images,
        }
        json_file = output_dir / f"{base_filename}.json"
        json_file.write_text(json.dumps(json_data, indent=2), encoding="utf-8")

        # Log extraction info
        logger.info(f"Extraction received from {data.get('siteName', 'unknown')}")
        logger.info(f"URL: {data.get('url', 'unknown')}")
        logger.info(f"Elements: {data.get('elementCount', 0)}")
        logger.info(f"Images: {data.get('imageCount', 0)}")
        logger.info(f"HTML saved: {html_file}")
        logger.info(f"JSON saved: {json_file}")

        # Persist to database
        db_success, db_error = persist_to_database(
            data, html_file, json_file, downloaded_images, base_filename, db
        )

        return ExtractionResponse(
            status="success",
            message="Data received successfully",
            extraction_count=len(extractions),
            files=FileInfo(
                html=str(html_file),
                json_file=str(json_file),
                images=[
                    img.get("local_path", "")
                    for img in downloaded_images
                    if "local_path" in img
                ],
            ),
            database=DatabaseInfo(
                persisted=db_success,
                error=db_error if not db_success else None,
            ),
        )

    except Exception as e:
        logger.error(f"Error receiving extraction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/extractions")
async def list_extractions() -> dict[str, Any]:
    """List all received extractions."""
    return {
        "total": len(extractions),
        "extractions": [
            {
                "timestamp": ext.get("timestamp"),
                "url": ext.get("url"),
                "siteName": ext.get("siteName"),
                "elementCount": ext.get("elementCount"),
            }
            for ext in extractions
        ],
    }


@router.get("/extractions/{index}")
async def get_extraction(index: int) -> dict[str, Any]:
    """Get a specific extraction by index."""
    if 0 <= index < len(extractions):
        return extractions[index]
    raise HTTPException(status_code=404, detail="Extraction not found")


@router.post("/clear")
async def clear_extractions() -> dict[str, str]:
    """Clear all stored extractions."""
    extractions.clear()
    logger.info("All extractions cleared")
    return {"status": "success", "message": "All extractions cleared"}
