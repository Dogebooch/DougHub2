"""
DougHub2 FastAPI Application.

This module initializes the FastAPI application for the DougHub2
extraction service and includes all API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from doughub2.api.extraction import router as extraction_router

app = FastAPI(
    title="DougHub2 Extraction API",
    description="API for extracting questions from HTML/documents",
    version="0.1.0",
)

# Enable CORS for all routes (needed for Tampermonkey userscript)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
