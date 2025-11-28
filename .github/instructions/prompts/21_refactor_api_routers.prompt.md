
**Title:** STEP-021: Refactor Endpoints into API Routers

**Goal:** Decompose the monolithic FastAPI application by organizing related endpoints into separate `APIRouter` files.

**Context:**

- All API endpoints are currently defined in `src/doughub2/main.py`.
- This makes the application hard to navigate and maintain.
- We will group question-related endpoints and extraction-related endpoints into their own router modules within a new `api` directory.

**Tasks:**

1.  **Create API Directory:** Create a new directory: `src/doughub2/api`. Add an `__init__.py` file to make it a package.
2.  **Create Questions Router:**
    - Create the file `src/doughub2/api/questions.py`.
    - In this file, create an `APIRouter` instance.
    - Move the `/questions` and `/questions/{question_id}` endpoint functions from `main.py` into this file.
    - Update the function decorators to use the new router instance (e.g., `@router.get(...)`).
    - Add all necessary imports (`APIRouter`, `Depends`, `Session`, `QuestionRepository`, `QuestionListResponse`, `QuestionDetailResponse`, etc.).
3.  **Create Extractions Router:**
    - Create the file `src/doughub2/api/extractions.py`.
    - Create an `APIRouter` instance.
    - Move the `/extract`, `/extractions`, `/extractions/{index}`, and `/clear` endpoints from `main.py` into this file.
    - Move all related helper functions (`parse_source_and_key`, `copy_image_to_media_root`, `download_images`, `persist_to_database`, `sanitize_source_name`, `parse_timestamp_for_path`) into this file as well, as they are only used by the extraction endpoint.
    - Update decorators and add all necessary imports.
4.  **Update `main.py`:**
    - Remove all the endpoint functions and helper functions that were moved.
    - Import the router objects from `doughub2.api.questions` and `doughub2.api.extractions`.
    - Include the routers in the main `api_app` using `api_app.include_router()`, optionally providing a `prefix` like `/api/v1`. For now, we will add them at the root.

**Files to Inspect or Edit:**

- `src/doughub2/main.py` (Edit)
- `src/doughub2/api/__init__.py` (Create)
- `src/doughub2/api/questions.py` (Create)
- `src/doughub2/api/extractions.py` (Create)

**Commands:**

- No new packages are required.
- `poetry run uvicorn src.doughub2.main:app --reload`

**Tests and Validation:**

1.  After refactoring, run the backend server and ensure it starts without errors.
2.  Check the API docs at `http://localhost:8000/docs`. All endpoints should still be present.
3.  Test the following endpoints to ensure they function correctly:
    - `GET /questions`
    - `GET /questions/{id}` (with a valid ID)
    - `POST /extract` (with valid payload)
4.  Run the project's test suite to check for regressions.

**Exit Criteria:**

- [ ] The directory `src/doughub2/api` exists with `questions.py` and `extractions.py`.
- [ ] Endpoints are no longer defined directly in `main.py`.
- [ ] `main.py` is significantly smaller and includes the new routers.
- [ ] The application runs, and all previous API functionality remains intact.
- [ ] API documentation is complete and correct.

