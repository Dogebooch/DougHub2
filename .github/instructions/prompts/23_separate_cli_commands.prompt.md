
**Title:** STEP-023: Separate CLI Commands into CLI Module

**Goal:** Complete the refactoring of `main.py` by moving the Typer CLI commands into their own dedicated module.

**Context:**

- The `main.py` file currently serves a dual purpose, defining both the FastAPI web application and the Typer command-line interface.
- Separating the CLI logic into a `cli.py` file will create a clear distinction between the web server and the command-line tools, improving maintainability.

**Tasks:**

1.  **Create `cli.py`:** Create a new file at `src/doughub2/cli.py`.
2.  **Move CLI Logic:**
    - Move the Typer app instance (`cli = typer.Typer(...)`) from `main.py` to `cli.py`.
    - Move all functions decorated with `@cli.command()` (`serve`, `test`, `build_frontend`, `dev`) from `main.py` to `cli.py`.
3.  **Update Imports in `cli.py`:**
    - Add all necessary imports to `cli.py` (`typer`, `uvicorn`, `subprocess`, `sys`, `Path`).
    - Import the `api_app` instance from `doughub2.main` to be used by the `serve` and `dev` commands.
4.  **Clean up `main.py`:**
    - Remove the CLI-related functions and imports. The `main.py` file should now only be responsible for creating and configuring the FastAPI `api_app`.
    - Remove the `if __name__ == "__main__":` block.
5.  **Update Entry Point:**
    - Open `src/doughub2/__main__.py`.
    - Change the file to import the `cli` object from `doughub2.cli` and run it. The file content should be:
      ```python
      from doughub2.cli import cli
      if __name__ == "__main__":
          cli()
      ```
6.  **Verify `pyproject.toml`:**
    - Check the `pyproject.toml` file. The `[tool.poetry.scripts]` section should point to the new entry point. It should look something like this:
      `doughub2 = "doughub2.cli:cli"`
    - If it points to `doughub2.main:app`, update it.

**Files to Inspect or Edit:**

- `src/doughub2/main.py` (Edit)
- `src/doughub2/cli.py` (Create)
- `src/doughub2/__main__.py` (Edit)
- `pyproject.toml` (Inspect/Edit)

**Commands:**

- No new packages required.
- Test the CLI commands directly from the terminal.

**Tests and Validation:**

1.  After refactoring, test each CLI command from your terminal:
    - `poetry run doughub2 serve` (or `dev`) and check if the web server starts.
    - `poetry run doughub2 test` and verify the test suite runs.
    - `poetry run doughub2 build-frontend` and confirm the build process is triggered.
2.  Ensure the web application itself still runs correctly and that the separation did not break the server logic.
3.  Confirm that the `main.py` module is now clean and focused solely on the FastAPI application setup.

**Exit Criteria:**

- [ ] `cli.py` exists and contains all Typer CLI commands.
- [ ] `main.py` is free of Typer-related code.
- [ ] The `__main__.py` and `pyproject.toml` entry points correctly point to the `cli` object in `doughub2.cli`.
- [ ] All CLI commands (`serve`, `dev`, `test`, `build-frontend`) are functional.
- [ ] The web application can still be served correctly via the `serve` or `dev` commands.

