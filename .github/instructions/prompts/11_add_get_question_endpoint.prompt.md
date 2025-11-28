---

**Title:** STEP-011: Add API Endpoint to Get a Single Question

**Goal:** Create a new API endpoint to retrieve the full details, including `raw_html`, for a single question by its ID. This endpoint is essential for the frontend to display the content of a selected question.

**Context:**

- The backend is a FastAPI application in `src/doughub2/main.py`.
- The `QuestionRepository` in `src/doughub2/persistence/repository.py` is used for database access.
- API tests are located in `tests/test_api.py`.
- A previous prompt added an endpoint to list all questions.

**Tasks:**

1.  **Define a Pydantic Response Model:**
    - In `src/doughub2/main.py`, create a new Pydantic model `QuestionDetailResponse` that includes `question_id`, `source_name`, `source_question_key`, and `raw_html`.

2.  **Create the API Endpoint:**
    - In `src/doughub2/main.py`, add a new endpoint `GET /questions/{question_id}`.
    - The endpoint must accept an integer `question_id` as a path parameter.
    - Use the `QuestionRepository` to fetch the specified question from the database.
    - If the question is not found, the endpoint must return an `HTTPException` with a `404 Not Found` status code.
    - If the question is found, return its details serialized using the `QuestionDetailResponse` model.

3.  **Add a Test Case:**
    - In `tests/test_api.py`, add a new test class `TestGetQuestionEndpoint`.
    - Add a test `test_get_question_returns_correct_data` to this class.
        - In the test, create a sample question in the test database.
        - Make a `GET` request to `/questions/{question_id}` using the ID of the created question.
        - Assert that the response is successful (status code 200).
        - Assert that the returned data (`question_id`, `raw_html`, etc.) matches the sample question.
    - Add a second test `test_get_question_returns_404_for_invalid_id`.
        - In this test, make a `GET` request to `/questions/{question_id}` with an ID that does not exist.
        - Assert that the response status code is `404`.

**Files to Inspect or Edit:**

- `src/doughub2/main.py`
- `tests/test_api.py`

**Commands:**

- `poetry run pytest tests/test_api.py`

**Tests and Validation:**

1.  Run `poetry run pytest tests/test_api.py` after implementing the changes.
2.  Verify that the two new tests pass and that all existing tests continue to pass.

**Exit Criteria:**

- [ ] A new `GET /questions/{question_id}` endpoint is implemented in `src/doughub2/main.py`.
- [ ] The endpoint successfully returns question details for a valid ID.
- [ ] The endpoint returns a 404 error for a non-existent question ID.
- [ ] New tests for the endpoint are added to `tests/test_api.py`.
- [ ] The entire test suite passes without errors.

---
