---

**Title:** STEP-015: Serve UI from FastAPI and Document the Process

**Goal:** Configure the FastAPI backend to serve the built React application's static files and document the full build and run process for production.

**Context:**

- The frontend is a React application created with Vite, which builds to a `dist` directory.
- The backend is a FastAPI application.
- For a seamless user experience, the backend should serve the frontend, creating a single application.
- The `README.md` file needs to be updated with instructions for running the integrated application.

**Tasks:**

1.  **Configure Static File Serving in FastAPI:**
    - In `src/doughub2/main.py`, import `StaticFiles` from `fastapi.staticfiles`.
    - Mount the `dist` directory of the frontend build as a static directory. The path to the `dist` directory will be relative to the `main.py` file. A good path would be `/`.
    - **Important:** Make sure this mounting does not conflict with the existing `/api` endpoints. The static files middleware should be one of the last ones added.

2.  **Add a Catch-All Route for SPA:**
    - To make `react-router-dom` work correctly in production, any path that is not an API endpoint or a static file should serve the `index.html` file from the `dist` directory.
    - Add a catch-all `GET` route at the end of your routes in `main.py` that serves the `index.html` file for any unmatched path. You can use `FileResponse` for this.

3.  **Update the Build Process:**
    - The developer will need to remember to build the frontend before running the backend in production mode.
    - We can add a script to `pyproject.toml` later to automate this, but for now, we will document it.

4.  **Update the README:**
    - Open the `README.md` file.
    - Add a new section called "Running in Production".
    - In this section, provide clear, step-by-step instructions:
        1.  Navigate to the `src/doughub2/ui/frontend` directory and run `npm install` and then `npm run build`.
        2.  Navigate back to the project root.
        3.  Run the backend server using a production-ready server like `uvicorn` (e.g., `poetry run uvicorn doughub2.main:api_app --host 0.0.0.0 --port 8000`).
        4.  Explain that the application, including the UI, will now be available at `http://localhost:8000`.

**Files to Inspect or Edit:**

- `src/doughub2/main.py`
- `README.md`

**Commands:**

- `npm run build` (inside `src/doughub2/ui/frontend`)
- `poetry run uvicorn doughub2.main:api_app --host 0.0.0.0 --port 8000`

**Tests and Validation:**

1.  Build the frontend application.
2.  Start the FastAPI server using the production command.
3.  Open a browser and navigate to `http://localhost:8000`.
4.  Verify that the React application loads.
5.  Navigate to a question detail page (e.g., `http://localhost:8000/question/1`) directly by typing the URL in the browser.
6.  Verify that the detail page loads correctly (the catch-all route is working).
7.  Verify that existing API endpoints like `/api/extract` still work correctly.

**Exit Criteria:**

- [ ] FastAPI is configured to serve the static files from the frontend's `dist` directory.
- [ ] A catch-all route is implemented to support client-side routing.
- [ ] The `README.md` file contains clear instructions for building and running the application in production.
- [ ] The application runs correctly in production mode, serving both the backend API and the frontend UI from a single server.

---
