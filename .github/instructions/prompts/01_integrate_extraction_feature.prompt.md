**Title:** STEP-001: Initial Setup for Question Extraction API

**Goal:** Create the initial FastAPI application structure and a placeholder endpoint for the question extraction feature. This will establish the backend service that will later house the core parsing and extraction logic.

**Context:**
- The project uses FastAPI for the backend, as defined in the `gemini.instructions.md`.
- The backend source code should reside in `src/doughub2/`.
- This is the first step in building the "Question Extraction" feature.

**Tasks:**

1.  **Create a `main.py` file** inside `src/doughub2/` if it doesn't exist.
2.  **Initialize a FastAPI app** in `main.py`.
3.  **Add a basic root endpoint** (`/`) that returns a simple JSON message like `{"message": "DougHub2 Extraction API"}`.
4.  **Create a new router** for extraction-related endpoints in a new file: `src/doughub2/api/extraction.py`.
5.  **Add a placeholder endpoint** `/extract` to the new router. It should accept a POST request with a JSON body containing a `url` field. For now, it should just return the received URL.
6.  **Include the new router** in the main FastAPI app in `main.py`.
7.  **Ensure all new Python files** have basic docstrings and follow PEP 8 conventions.

**Files to Inspect or Edit:**

- `src/doughub2/main.py` (Create or Edit)
- `src/doughub2/api/extraction.py` (Create)
- `pyproject.toml` (Inspect for FastAPI dependency)

**Commands:**

1.  `poetry add fastapi uvicorn` (if not already added)
2.  `poetry run uvicorn doughub2.main:app --reload` (to run the server)

**Tests and Validation:**

1.  Start the server using the command above.
2.  Navigate to `http://127.0.0.1:8000` in a browser or with `curl`. You should see `{"message":"DougHub2 Extraction API"}`.
3.  Send a POST request to `http://127.0.0.1:8000/extract` with a JSON payload like `{"url": "http://example.com"}`.
4.  Verify the server responds with `{"url": "http://example.com"}`.

**Exit Criteria:**

- [ ] FastAPI is added as a project dependency.
- [ ] The server runs without errors.
- [ ] The root (`/`) endpoint is accessible and returns the correct message.
- [ ] The `/extract` endpoint exists and correctly echoes the URL from the request body.
- [  ] The code is formatted with `black` and passes `ruff` checks.
- [ ] All temporary files and debugging statements have been removed.