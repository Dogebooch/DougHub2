"""
DougHub2 Main Entry Point.

This module contains the Typer CLI application and FastAPI web application.
API endpoints are organized into separate routers in the doughub2.api package.
"""

import logging
from pathlib import Path

import typer
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from doughub2.api import extractions_router, questions_router

logger = logging.getLogger("doughub2")

# =============================================================================
# Typer CLI Application
# =============================================================================


def default_callback(ctx: typer.Context):
    """Default callback - run dev server if no command specified."""
    if ctx.invoked_subcommand is None:
        # No subcommand given, run the dev server
        typer.echo("🚀 No command specified, starting dev server...")
        typer.echo("   (Use --help to see all commands)")
        typer.echo("")
        import uvicorn

        uvicorn.run(
            "doughub2.main:api_app",
            host="127.0.0.1",
            port=8000,
            reload=True,
        )


cli = typer.Typer(
    name="doughub2",
    add_completion=False,
    invoke_without_command=True,
    callback=default_callback,
)

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


# =============================================================================
# CLI Commands
# =============================================================================


@cli.command()
def serve(
    host: str = typer.Option("0.0.0.0", "--host", "-h", help="Host to bind to"),
    port: int = typer.Option(5000, "--port", "-p", help="Port to bind to"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Enable auto-reload"),
):
    """
    Start the DougHub2 web server.

    Runs the FastAPI server with the React frontend.
    Visit http://localhost:<port> to access the application.
    """
    typer.echo(f"🚀 Starting DougHub2 on http://{host}:{port}")
    typer.echo("   Frontend: http://localhost:{port}")
    typer.echo("   API Docs: http://localhost:{port}/docs")
    typer.echo("")
    uvicorn.run(
        api_app,
        host=host,
        port=port,
        reload=reload,
    )


@cli.command()
def test(
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Verbose output"),
    coverage: bool = typer.Option(False, "--coverage", "-c", help="Run with coverage"),
):
    """
    Run the test suite.

    Executes pytest on the tests/ directory.
    """
    import subprocess
    import sys

    cmd = [sys.executable, "-m", "pytest", "tests/"]

    if verbose:
        cmd.append("-v")

    if coverage:
        cmd.extend(["--cov=src/doughub2", "--cov-report=term-missing"])

    typer.echo("🧪 Running tests...")
    result = subprocess.run(cmd)
    raise typer.Exit(code=result.returncode)


@cli.command()
def build_frontend():
    """
    Build the React frontend.

    Runs 'npm run build' in the frontend directory.
    """
    import subprocess

    frontend_dir = Path(__file__).parent / "ui" / "frontend"

    if not frontend_dir.exists():
        typer.echo(f"❌ Frontend directory not found: {frontend_dir}", err=True)
        raise typer.Exit(code=1)

    typer.echo("🔨 Building frontend...")
    result = subprocess.run(
        ["npm", "run", "build"],
        cwd=frontend_dir,
        shell=True,  # Required on Windows for npm
    )

    if result.returncode == 0:
        typer.echo("✅ Frontend built successfully!")
    else:
        typer.echo("❌ Frontend build failed!", err=True)

    raise typer.Exit(code=result.returncode)


@cli.command()
def dev():
    """
    Start development servers (backend with reload).

    Equivalent to: doughub2 serve --reload --port 8000
    """
    typer.echo("🔧 Starting DougHub2 in development mode...")
    typer.echo("   Backend:  http://localhost:8000")
    typer.echo("   API Docs: http://localhost:8000/docs")
    typer.echo("")
    uvicorn.run(
        api_app,
        host="127.0.0.1",
        port=8000,
        reload=True,
    )


# Keep 'app' as an alias for backward compatibility with pyproject.toml entry point
app = cli

if __name__ == "__main__":
    cli()
