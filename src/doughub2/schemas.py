"""
DougHub2 Pydantic Schemas.

This module contains all Pydantic models for API requests and responses.
"""

from typing import Any

from pydantic import BaseModel


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


class QuestionInfo(BaseModel):
    """Summary information about a question."""

    question_id: int
    source_name: str
    source_question_key: str


class QuestionListResponse(BaseModel):
    """Response model for listing questions."""

    questions: list[QuestionInfo]


class QuestionDetailResponse(BaseModel):
    """Response model for a single question with full details."""

    question_id: int
    source_name: str
    source_question_key: str
    raw_html: str
