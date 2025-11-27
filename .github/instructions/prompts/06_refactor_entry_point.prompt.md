---

**Title:** STEP-06: Consolidate FastAPI App Entry Point

**Goal:** Refactor the backend to have a single, clear entry point in `src/doughub2/main.py` by merging the FastAPI app definition from `src/doughub2/api/app.py`.

**Context:**

- Currently, the `typer` CLI is defined in `main.py`, but the `FastAPI` app instance it's supposed to run is defined in `api/app.py`.
- This separation is confusing and splits the core application logic.
- This refactor will centralize the application's definition and startup logic into a single file, improving clarity and maintainability, making `main.py` the true entry point.

**Tasks:**

1.  **Merge FastAPI Logic into `main.py`:**
    - Open `src/doughub2/api/app.py` and copy its entire contents (imports, `app = FastAPI(...)`, middleware, routers).
    - Paste this logic into the top of `src/doughub2/main.py`, below the existing imports.
    - **Crucially, rename the FastAPI app variable** to avoid a name conflict with the `typer` app. Change `app = FastAPI(...)` to `api_app = FastAPI(...)`.

2.  **Update Imports in `main.py`:**
    - Ensure all necessary imports from `fastapi`, `fastapi.middleware.cors`, and `doughub2.api.extraction` are present in `main.py`.
    - Also ensure the router is included correctly with the renamed app: `api_app.include_router(extraction_router)`.

3.  **Update the `serve` Command:**
    - In `src/doughub2/main.py`, find the `serve` function.
    - Modify the `uvicorn.run(...)` call. The first argument, which is currently the string `"doughub2.api.app:app"`, must be changed to point directly to the `api_app` object you just moved into the file. The call should look like this:
      ```python
      uvicorn.run(
          api_app,  # Changed from "doughub2.api.app:app"
          host=host,
          port=port,
          reload=reload,
      )
      ```

4.  **Delete Redundant File:**
    - The file `src/doughub2/api/app.py` is now redundant. Delete it.

**Files to Inspect or Edit:**

- `src/doughub2/main.py` (Edit)
- `src/doughub2/api/app.py` (Delete)

**Commands:**

- To run and test the refactored application: `poetry run doughub2 serve`

**Tests and Validation:**

1.  After the refactor, run the `serve` command: `poetry run doughub2 serve`.
2.  The server should start without errors, confirming that `uvicorn` found the `api_app` object correctly.
3.  Access the root URL of the server (e.g., `http://127.0.0.1:5000/`). The browser should display the JSON response `{"message":"DougHub2 Extraction API"}`. This verifies that the app, its middleware, and routers are all functioning correctly from the single entry point.
4.  Confirm that the file `src/doughub2/api/app.py` has been deleted from the project.

**Exit Criteria:**

- [ ] All FastAPI application logic has been moved from `api/app.py` into `main.py`.
- [ ] The FastAPI app instance in `main.py` is named `api_app` to prevent name conflicts.
- [ ] The `serve` command in `main.py` correctly starts `uvicorn` using the in-memory `api_app` object.
- [ ] The application starts and runs correctly using the `poetry run doughub2 serve` command.
- [ ] The redundant `src/doughub2/api/app.py` file has been deleted.

---
