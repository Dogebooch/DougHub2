"""
DougHub2 FastAPI Application.

This module initializes the FastAPI application for the DougHub2
extraction service and includes all API routers.
"""

from fastapi import FastAPI

from doughub2.api.extraction import router as extraction_router

app = FastAPI(
    title="DougHub2 Extraction API",
    description="API for extracting questions from HTML/documents",
    version="0.1.0",
)


@app.get("/")
async def root() -> dict:
    """
    Root endpoint returning a welcome message.

    Returns:
        A JSON message identifying the API.
    """
    return {"message": "DougHub2 Extraction API"}


# Include routers
app.include_router(extraction_router)
