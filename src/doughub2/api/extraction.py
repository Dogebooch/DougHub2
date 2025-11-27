"""
Extraction API Router.

This module provides endpoints for the question extraction feature,
allowing users to submit URLs for parsing and extraction of questions.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(tags=["extraction"])


class ExtractionRequest(BaseModel):
    """Request model for the extraction endpoint."""

    url: str


class ExtractionResponse(BaseModel):
    """Response model for the extraction endpoint."""

    url: str


@router.post("/extract", response_model=ExtractionResponse)
async def extract(request: ExtractionRequest) -> ExtractionResponse:
    """
    Extract questions from the provided URL.

    This is a placeholder endpoint that currently echoes the received URL.
    Future implementation will parse the URL content and extract questions.

    Args:
        request: The extraction request containing the URL to process.

    Returns:
        ExtractionResponse containing the processed URL.
    """
    return ExtractionResponse(url=request.url)
