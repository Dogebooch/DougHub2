"""
DougHub2 FastAPI Application.

This module contains the FastAPI web application for DougHub2.
API endpoints are organized into separate routers in the doughub2.api package.

For CLI commands, see doughub2.cli module.
"""

import logging
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from doughub2.api import extractions_router, questions_router

logger = logging.getLogger("doughub2")

# =============================================================================
# FastAPI Application
# =============================================================================

api_app = FastAPI(
    title="DougHub2 Extraction API",
    description="API for extracting questions from HTML/documents",
    version="0.1.0",
)

# Enable CORS for all routes (needed for Tampermonkey userscript)
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
api_app.include_router(questions_router)
api_app.include_router(extractions_router)

# =============================================================================
# Root Endpoint
# =============================================================================


@api_app.get("/")
async def root() -> dict:
    """
    Root endpoint returning a welcome message.

    Returns:
        A JSON message identifying the API.
    """
    return {"message": "DougHub2 Extraction API"}


# =============================================================================
# Static File Serving (Production)
# =============================================================================

# Path to the frontend build directory
FRONTEND_DIST_DIR = Path(__file__).parent / "ui" / "frontend" / "dist"


@api_app.get("/{full_path:path}")
async def serve_spa(full_path: str) -> FileResponse:
    """
    Catch-all route for serving the React SPA.

    This route handles all paths not matched by API endpoints, serving either:
    - Static files from the frontend build (if they exist)
    - The index.html for client-side routing (for all other paths)

    This enables react-router-dom to handle routing in the browser.
    """
    # First, check if the requested file exists in the dist directory
    file_path = FRONTEND_DIST_DIR / full_path
    if file_path.is_file():
        return FileResponse(file_path)

    # For all other paths, serve index.html (SPA catch-all)
    index_path = FRONTEND_DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)

    # If frontend is not built, return a helpful error
    raise HTTPException(
        status_code=404,
        detail="Frontend not found. Run 'npm run build' in src/doughub2/ui/frontend/",
    )
