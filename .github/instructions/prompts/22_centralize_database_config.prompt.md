
**Title:** STEP-022: Centralize Database Configuration

**Goal:** Improve code organization by moving all database connection and session management logic into a dedicated module.

**Context:**

- Database setup code (engine creation, session factory) is currently located in `src/doughub2/main.py`.
- Centralizing this in a `database.py` file makes the configuration easier to manage and decouples the main application from the database setup details.

**Tasks:**

1.  **Create `database.py`:** Create a new file at `src/doughub2/database.py`.
2.  **Move Database Logic:**
    - Cut the `_engine`, `_SessionLocal` global variables from `main.py` and paste them into `database.py`.
    - Cut the `get_engine`, `get_session_local`, and `get_db` functions from `main.py` and paste them into `database.py`.
3.  **Update Imports in `database.py`:** Add all necessary imports to the new file, such as `create_engine`, `sessionmaker`, `Session`, `Generator`, `settings`, and `Base`.
4.  **Update Imports in Router Files:**
    - The `get_db` dependency is used in the API routers (`questions.py`, `extractions.py`). Update the import statements in these files to import `get_db` from `doughub2.database`.
    - The `main.py` file might also need its imports adjusted or removed.

**Files to Inspect or Edit:**

- `src/doughub2/main.py` (Edit)
- `src/doughub2/database.py` (Create)
- `src/doughub2/api/questions.py` (Edit)
- `src/doughub2/api/extractions.py` (Edit)

**Commands:**

- No new packages are required.
- `poetry run uvicorn src.doughub2.main:app --reload`

**Tests and Validation:**

1.  After refactoring, restart the web server and ensure it runs without import errors.
2.  Access the API docs at `http://localhost:8000/docs` to confirm the application is running.
3.  Make a request to an endpoint that uses the database, such as `GET /questions`.
4.  Verify that the request succeeds and returns data from the database, confirming that the `get_db` dependency is working correctly.
5.  Run the full test suite to check for any regressions.

**Exit Criteria:**

- [ ] The file `src/doughub2/database.py` exists and contains the database setup and session logic.
- [ ] `src/doughub2/main.py` no longer contains database-specific setup code.
- [ ] All API endpoints that require a database session correctly import and use the `get_db` dependency from the new module.
- [ ] The application remains fully functional.

