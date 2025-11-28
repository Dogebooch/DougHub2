
**Title:** STEP-020: Refactor API Models into Schemas Module

**Goal:** Improve the backend's code organization by separating the Pydantic data models from the main application logic.

**Context:**

- Currently, all Pydantic models for API requests and responses are defined directly in `src/doughub2/main.py`.
- This makes the `main.py` file overly long and mixes data contract definitions with application logic, violating the Single Responsibility Principle.
- We will move these models to a dedicated `schemas.py` file.

**Tasks:**

1.  **Create New File:** Create a new file named `src/doughub2/schemas.py`.
2.  **Move Models:** Cut all Pydantic model classes (`ImageInfo`, `ExtractionRequest`, `FileInfo`, `DatabaseInfo`, `ExtractionResponse`, `QuestionInfo`, `QuestionListResponse`, `QuestionDetailResponse`) from `src/doughub2/main.py` and paste them into the new `src/doughub2/schemas.py` file.
3.  **Add Imports:** Add the necessary imports to the top of `schemas.py` (e.g., `from pydantic import BaseModel`, `from typing import Any, List`).
4.  **Update Imports in `main.py`:** In `src/doughub2/main.py`, remove the Pydantic model class definitions and replace them with a single import statement that imports all the necessary models from `doughub2.schemas`.

**Files to Inspect or Edit:**

- `src/doughub2/main.py` (Edit)
- `src/doughub2/schemas.py` (Create)

**Commands:**

- No new packages are required. Run the backend server to test.
- `poetry run uvicorn src.doughub2.main:app --reload`

**Tests and Validation:**

1.  After refactoring, run the backend server.
2.  Verify that the server starts without any import errors.
3.  Access the API documentation at `http://localhost:8000/docs`.
4.  Confirm that the API schema is unchanged and all models are correctly displayed for each endpoint.
5.  Perform a quick test on the `/questions` and `/extract` endpoints to ensure they still function as expected with the refactored models.
6.  Run the project's test suite to catch any regressions.

**Exit Criteria:**

- [ ] The new file `src/doughub2/schemas.py` exists and contains all Pydantic models.
- [ ] `src/doughub2/main.py` no longer contains any Pydantic model definitions.
- [ ] `main.py` correctly imports the models from `doughub2.schemas`.
- [ ] The web server runs successfully after the changes.
- [ ] The API documentation correctly reflects the data models.
