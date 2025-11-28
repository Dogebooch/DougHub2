"""
DougHub2 CLI Module.

This module contains all CLI commands for the DougHub2 application using Typer.
The CLI provides commands for running the server, tests, and development tasks.
"""

import logging
import subprocess
import sys
import threading
import time
import webbrowser
from pathlib import Path

import typer
import uvicorn

logger = logging.getLogger("doughub2")

# =============================================================================
# Typer CLI Application
# =============================================================================


def _open_browser_delayed(url: str, delay: float = 1.5):
    """Open browser after a short delay to allow server to start."""
    def _open():
        time.sleep(delay)
        webbrowser.open(url)
    
    thread = threading.Thread(target=_open, daemon=True)
    thread.start()


def default_callback(ctx: typer.Context):
    """Default callback - run dev server if no command specified."""
    if ctx.invoked_subcommand is None:
        # No subcommand given, run the dev server
        url = "http://127.0.0.1:8000"
        typer.echo("🚀 No command specified, starting dev server...")
        typer.echo("   (Use --help to see all commands)")
        typer.echo(f"   Opening browser: {url}")
        typer.echo("")
        _open_browser_delayed(url)
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
# CLI Commands
# =============================================================================


@cli.command()
def serve(
    host: str = typer.Option("0.0.0.0", "--host", "-h", help="Host to bind to"),
    port: int = typer.Option(5000, "--port", "-p", help="Port to bind to"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Enable auto-reload"),
    no_browser: bool = typer.Option(False, "--no-browser", help="Don't open browser"),
):
    """
    Start the DougHub2 web server.

    Runs the FastAPI server with the React frontend.
    Visit http://localhost:<port> to access the application.
    """
    # Import api_app here to avoid circular imports
    from doughub2.main import api_app

    # Determine the URL for browser
    browser_host = "localhost" if host == "0.0.0.0" else host
    url = f"http://{browser_host}:{port}"
    
    typer.echo(f"🚀 Starting DougHub2 on {url}")
    typer.echo(f"   Frontend: {url}")
    typer.echo(f"   API Docs: {url}/docs")
    typer.echo("")
    
    if not no_browser:
        _open_browser_delayed(url)
    
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
    url = "http://localhost:8000"
    typer.echo("🔧 Starting DougHub2 in development mode...")
    typer.echo(f"   Backend:  {url}")
    typer.echo(f"   API Docs: {url}/docs")
    typer.echo("")
    _open_browser_delayed(url)
    uvicorn.run(
        "doughub2.main:api_app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
