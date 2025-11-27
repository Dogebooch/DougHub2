---

**Title:** STEP-07: Clean Up Boilerplate and Consolidate API Routers

**Goal:** Simplify the codebase by removing unused boilerplate code and consolidating all API routes into the main application entry point for better clarity.

**Context:**

- Following the refactor in STEP-06, `src/doughub2/main.py` is the application's entry point. We can now clean it up further.
- The `main.py` file contains a placeholder `main` Typer command that is not used.
- The `tests/test_example.py` file is generic boilerplate and does not test our specific application logic.
- For a small API, splitting endpoints into different router files (`api/extraction.py`) is an unnecessary complexity. We will merge this logic directly into `main.py`.

**Tasks:**

1.  **Consolidate the `/extract` Route:**
    - Open `src/doughub2/api/extraction.py` and copy the entire `extract_questions` function (the one decorated with `@router.post("/extract")`).
    - Paste this function into `src/doughub2/main.py`.
    - Change its decorator from `@router.post("/extract")` to `@api_app.post("/extract")`, registering it directly with the main FastAPI app instance.
    - Ensure any imports required by the `extract_questions` function are moved to `main.py` as well.
    - In `main.py`, remove the line that includes the old router (e.g., `api_app.include_router(extraction_router)`).

2.  **Remove Placeholder CLI Command:**
    - In `src/doughub2/main.py`, find and delete the entire `main` function that is decorated with `@app.command()`.
    - Also, delete the `ConfigOption` variable definition associated with it.
    - Keep the `version_callback` and `VersionOption` for now, but move them to be arguments of the main `typer.Typer()` app itself for a cleaner global version flag. Modify the `Typer` instantiation like so:
      ```python
      cli = typer.Typer(
          name="doughub2",
          add_completion=False,
          result_callback=version_callback, # Or handle version directly
      )
      # Note: This is a conceptual change. The developer agent should implement the idiomatic way to have a global --version flag with Typer without a default command. If it's too complex, simply removing the version logic along with the main command is acceptable. The primary goal is removing the placeholder 'main' command.
      ```
      A simpler, preferred approach is to **delete the `main` command and all its associated options (`ConfigOption`, `VersionOption`, and `version_callback`) entirely**. The `serve` command is the only useful one at this stage.

3.  **Delete Unused Files and Directories:**
    - Delete the file `src/doughub2/api/extraction.py`.
    - If the `src/doughub2/api/` directory is now empty, delete it as well.
    - Delete the file `tests/test_example.py`.

**Files to Inspect or Edit:**

- `src/doughub2/main.py` (Edit)
- `src/doughub2/api/extraction.py` (Delete)
- `src/doughub2/api/` (Delete if empty)
- `tests/test_example.py` (Delete)

**Commands:**

- `poetry run doughub2 --help`
- `poetry run doughub2 serve`
- `poetry run pytest`

**Tests and Validation:**

1.  Run `poetry run doughub2 --help`. The output should **only** list `serve` under "Commands", and the placeholder `main` command should be gone.
2.  Start the server with `poetry run doughub2 serve`. It should start correctly.
3.  Send a POST request to the `/extract` endpoint. It must work as it did before, confirming the route was consolidated successfully.
4.  Run `poetry run pytest`. The tests should execute without error, and `test_example.py` should no longer be part of the test run.
5.  Verify that `tests/test_example.py` and `src/doughub2/api/extraction.py` have been deleted.

**Exit Criteria:**

- [ ] The placeholder `main` CLI command and its associated options are removed from `main.py`.
- [ ] The `/extract` endpoint logic is now defined directly in `main.py`.
- [ ] The `src/doughub2/api/` directory and its contents have been deleted.
- [ ] The `tests/test_example.py` file is deleted.
- [ ] The application continues to run correctly, and all existing tests pass.
---
