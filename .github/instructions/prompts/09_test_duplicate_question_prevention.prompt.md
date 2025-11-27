---

**Title:** STEP-009: Test Duplicate Question Prevention

**Goal:** Add a test case to verify that the duplicate question prevention logic is working as expected. This test will ensure that submitting a question with the same content but a different URL does not create a new record in the database.

**Context:**

- The project uses `pytest` for testing.
- The relevant test file is `tests/test_api.py`.
- A previous change introduced logic to prevent duplicate questions based on their `bodyText`.

**Tasks:**

1.  **Open `tests/test_api.py`**.
2.  **Add a new test method** to the `TestDatabasePersistence` class called `test_duplicate_question_by_content_not_created`.
3.  **In the new test method:**
    a. Define a payload for the `/extract` endpoint. This payload should include a unique URL and `bodyText`.
    b. Send a POST request to `/extract` with this payload.
    c. Assert that the request was successful and that a `Question` record was created in the test database.
    d. Define a second payload with a *different* URL but the *same* `bodyText` as the first payload.
    e. Send a POST request to `/extract` with the second payload.
    f. Assert that this second request was also successful.
    g. Query the database to count the total number of `Question` records.
    h. Assert that the total number of questions is still 1, confirming that the duplicate was not saved.

**Files to Inspect or Edit:**

- `tests/test_api.py`

**Commands:**

- `poetry run pytest tests/test_api.py`

**Tests and Validation:**

1.  Run the `pytest` command provided above.
2.  Verify that all tests, including the new `test_duplicate_question_by_content_not_created` test, pass successfully.

**Exit Criteria:**

- [ ] A new test `test_duplicate_question_by_content_not_created` exists in `tests/test_api.py`.
- [ ] The new test successfully verifies that duplicate questions (by content) are not persisted.
- [ ] The entire test suite in `test_api.py` passes without errors.
- [ ] No debugging statements or temporary code have been left in the test file.

---
