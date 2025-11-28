---

**Title:** STEP-010: Add API Endpoint to List Questions

**Goal:** Create a new API endpoint that retrieves and returns a list of all extracted questions from the database. This will be used by the frontend to display a list of available questions.

**Context:**

- The backend is a FastAPI application located in `src/doughub2/main.py`.
- Database interactions are handled by the `QuestionRepository` in `src/doughub2/persistence/repository.py`.
- API tests are in `tests/test_api.py`.

**Tasks:**

1.  **Define a Pydantic Response Model:**
    - In `src/doughub2/main.py`, create a new Pydantic model `QuestionInfo` that includes `question_id`, `source_name`, and `source_question_key`.
    - Create another model `QuestionListResponse` that contains a list of `QuestionInfo` objects.

2.  **Create the API Endpoint:**
    - In `src/doughub2/main.py`, add a new endpoint `GET /questions` that returns a `QuestionListResponse`.
    - The endpoint should use the `QuestionRepository` to fetch all questions from the database.
    - It should then map the `Question` objects to `QuestionInfo` objects and return them.

3.  **Add a Test Case:**
    - In `tests/test_api.py`, add a new test class `TestListQuestionsEndpoint`.
    - Add a test `test_list_questions_returns_all_questions` to this class.
    - In the test, first create a few sample questions in the test database.
    - Then, make a `GET` request to the `/questions` endpoint.
    - Assert that the response is successful (status code 200).
    - Assert that the number of questions in the response matches the number of questions created.
    - Assert that the content of the questions in the response is correct.

**Files to Inspect or Edit:**

- `src/doughub2/main.py`
- `tests/test_api.py`

**Commands:**

- `poetry run pytest tests/test_api.py`

**Tests and Validation:**

1.  After implementing the endpoint and test, run `poetry run pytest tests/test_api.py`.
2.  Verify that the new test passes and that no existing tests have failed.

**Exit Criteria:**

- [ ] A new `GET /questions` endpoint exists in `src/doughub2/main.py`.
- [ ] The endpoint returns a list of all questions with their ID, source name, and source key.
- [ ] A new test for the `/questions` endpoint exists in `tests/test_api.py`.
- [ ] The entire test suite passes.

---
