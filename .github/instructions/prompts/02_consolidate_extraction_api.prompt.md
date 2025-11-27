**Title:** STEP-002: Consolidate and Refactor Question Extraction API

**Goal:** Unify the fragmented question extraction feature by migrating the logic from the legacy Flask application in `for_export/` into the primary FastAPI application in `src/doughub2/`. This will eliminate redundant code, establish a single source of truth for the API, and align the project with its intended architecture.

**Context:**

- The project currently has two parallel implementations for question extraction:
  1. A legacy, but functional, Flask server in `for_export/extraction_server.py`.
  2. A skeleton placeholder FastAPI endpoint in `src/doughub2/api/extraction.py`.
- The core business logic, including database models and persistence, resides in `for_export/doughub/`.
- The client-side `for_export/question_extractor.user.js` is hardcoded to send requests to `http://localhost:5000`.
- The tests in `tests/test_api.py` are basic and only cover the placeholder endpoint.

**Tasks:**

1.  **Relocate Models:**
    -   Create a new file: `src/doughub2/models.py`.
    -   Move the SQLAlchemy model classes (`Base`, `Source`, `Question`, `Media`, `Log`) from `for_export/doughub/models.py` to the new `src/doughub2/models.py`.
    -   Remove the Anki-related dataclasses (`Deck`, `NoteType`, `Note`, `Card`) from the new `models.py` file, as they are not part of the extraction API. They can be added back later when the Anki feature is implemented.

2.  **Relocate Persistence Logic:**
    -   Create a new directory: `src/doughub2/persistence/`.
    -   Create a new file: `src/doughub2/persistence/__init__.py` (it can be empty).
    -   Create a new file: `src/doughub2/persistence/repository.py`.
    -   Move the `QuestionRepository` class from `for_export/doughub/persistence/repository.py` to `src/doughub2/persistence/repository.py`.
    -   Update the imports in the new `repository.py` to reference `doughub2.models` and `doughub2.config`.

3.  **Create Configuration:**
    -   Create a new file: `src/doughub2/config.py`.
    -   Add the `DATABASE_URL` and `MEDIA_ROOT` configurations from `for_export/doughub/config.py` to `src/doughub2/config.py`.

4.  **Implement FastAPI Endpoint:**
    -   Modify `src/doughub2/api/extraction.py`.
    -   Rewrite the `extract` function to incorporate the logic from the `receive_extraction` function in `for_export/extraction_server.py`.
    -   This includes: receiving the JSON payload, saving HTML, downloading images, and calling the `QuestionRepository` to persist the data.
    -   Use FastAPI's dependency injection system to manage the database session for the repository.
    -   The Pydantic models `ExtractionRequest` and `ExtractionResponse` should be updated to reflect the actual data being passed and returned.

5.  **Update FastAPI App:**
    -   Modify `src/doughub2/main.py` (or `src/doughub2/api/app.py` as appropriate) to run on port `5000` to be compatible with the existing user script. The `uvicorn.run` command should be updated.

6.  **Expand Test Suite:**
    -   Modify `tests/test_api.py`.
    -   Update the tests for the `/extract` endpoint to cover the new, full functionality.
    -   Use a test database (e.g., in-memory SQLite).
    -   Add a test case for a basic payload without images, verifying that a `Question` is created in the database.
    -   Add a more complex test case for a payload that includes an example question (raw HTML) and at least one image URL in the `images` list.
        -   Mock file system (`pathlib.Path.write_text`) and network (`urllib.request.urlretrieve`) functions to prevent actual I/O.
        -   Verify the endpoint correctly processes a payload containing image data.
        -   Assert that the mocked `urlretrieve` is called with the correct image URL and a predictable local file path.
        -   Assert that the `QuestionRepository.add_media_to_question` method is called with the correct metadata for the image.
        -   Ensure the final JSON response includes information about the "downloaded" image.

7.  **Code Cleanup:**
    -   Delete the entire `for_export/` directory.

**Files to Inspect or Edit:**

-   `src/doughub2/models.py` (Create)
-   `src/doughub2/persistence/repository.py` (Create)
-   `src/doughub2/config.py` (Create)
-   `src/doughub2/api/extraction.py` (Edit)
-   `src/doughub2/main.py` (Edit)
-   `tests/test_api.py` (Edit)
-   `for_export/` (Delete)

**Commands:**

1.  `rm -rf for_export/` (or `rmdir /s /q for_export` on Windows)
2.  `poetry run pytest`

**Tests and Validation:**

1.  Run the test suite using `poetry run pytest`. All tests must pass, including the new tests for the consolidated extraction logic.
2.  Run the server: `poetry run uvicorn doughub2.main:app --host 0.0.0.0 --port 5000 --reload`.
3.  Manually send a POST request to `http://localhost:5000/extract` with a valid JSON payload (you can copy one from the user script's console output if you run it on a target page).
4.  Verify the server logs indicate successful persistence and returns a success message.

**Exit Criteria:**

-   [ ] The `for_export/` directory is deleted.
-   [ ] The extraction logic is consolidated into the FastAPI app under `src/doughub2/`.
-   [ ] The FastAPI server runs on port `5000`.
-   [ ] The `tests/test_api.py` file is updated with comprehensive tests for the new logic.
-   [ ] All tests pass when running `poetry run pytest`.
-   [ ] The application structure is clean, with no redundant Flask code.
