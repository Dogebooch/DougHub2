"""
DougHub2 FastAPI Application.

This module contains the FastAPI web application for DougHub2.
API endpoints are organized into separate routers in the doughub2.api package.

For CLI commands, see doughub2.cli module.
"""

import logging
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from doughub2.api import extractions_router, questions_router

# =============================================================================
# Project Root Configuration
# =============================================================================

# Calculate project root (main.py is in src/doughub2/, so go up 2 levels)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


def ensure_project_root():
    """Ensure the working directory is the project root.
    
    This allows the application to be run from any directory while still
    finding config files, data directories, and other resources correctly.
    """
    os.chdir(PROJECT_ROOT)


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
# Static File Serving (Production)
# =============================================================================

# Path to the frontend build directory
FRONTEND_DIST_DIR = Path(__file__).parent / "ui" / "frontend" / "dist"


@api_app.get("/")
async def serve_root() -> FileResponse:
    """
    Serve the React SPA at root.
    """
    index_path = FRONTEND_DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    
    # Fallback to API message if frontend not built
    raise HTTPException(
        status_code=404,
        detail="Frontend not found. Run 'npm run build' in src/doughub2/ui/frontend/",
    )


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


# =============================================================================
# Direct Execution (Run Python File)
# =============================================================================

if __name__ == "__main__":
    import threading
    import time
    import webbrowser

    import uvicorn

    # Change to project root so relative paths work correctly
    ensure_project_root()
    print(f"📁 Working directory: {PROJECT_ROOT}")

    def open_browser():
        """Open browser after server starts."""
        time.sleep(1.5)
        webbrowser.open("http://127.0.0.1:8000")

    # Start browser opener in background thread
    threading.Thread(target=open_browser, daemon=True).start()

    print("🚀 Starting DougHub2...")
    print("   Frontend: http://127.0.0.1:8000")
    print("   API Docs: http://127.0.0.1:8000/docs")
    print("")

    uvicorn.run(api_app, host="127.0.0.1", port=8000)
