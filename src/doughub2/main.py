import logging

import typer
import uvicorn

from doughub2 import __title__, __version__, util

logger = logging.getLogger("doughub2")

app = typer.Typer(name="doughub2")


def version_callback(version: bool):
    if version:
        typer.echo(f"{__title__} {__version__}")
        raise typer.Exit()


ConfigOption = typer.Option(
    ..., "-c", "--config", metavar="PATH", help="path to the program configuration"
)
VersionOption = typer.Option(
    None,
    "-v",
    "--version",
    callback=version_callback,
    is_eager=True,
    help="print the program version and exit",
)


@app.command()
def main(config_file: str = ConfigOption, version: bool = VersionOption):
    """
    A personal hub project by Douglas Smith

    Note: This is the entry point of your command line application. The values of the CLI params
    that are passed to this application will show up als parameters to this function.
    This docstring is where you describe what your command line application does.
    Try running `python -m doughub2 --help` to see how this shows up in the
    command line.
    """
    config = util.load_config(config_file)
    util.logging_setup(config)
    logger.info("Looks like you're all set up. Let's get going!")
    # TODO your journey starts here


@app.command()
def serve(
    host: str = typer.Option("0.0.0.0", "--host", "-h", help="Host to bind to"),
    port: int = typer.Option(5000, "--port", "-p", help="Port to bind to"),
    reload: bool = typer.Option(False, "--reload", "-r", help="Enable auto-reload"),
):
    """
    Start the FastAPI extraction server.

    This runs the extraction API server that receives data from the
    Tampermonkey userscript. The server runs on port 5000 by default
    for compatibility with the existing userscript.
    """
    typer.echo(f"Starting DougHub2 Extraction Server on {host}:{port}")
    typer.echo("Waiting for extractions from Tampermonkey script...")
    uvicorn.run(
        "doughub2.api.app:app",
        host=host,
        port=port,
        reload=reload,
    )


if __name__ == "__main__":
    app()
