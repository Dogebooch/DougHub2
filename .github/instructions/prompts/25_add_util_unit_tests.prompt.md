
**Title:** STEP-025: Add Unit Tests for Backend Utilities

**Goal:** Improve backend code quality and reliability by creating unit tests for the helper functions in `src/doughub2/util.py`.

**Context:**

- The project has a `tests/test_util.py` file, but it is currently empty.
- The `src/doughub2/util.py` file contains important helper functions for parsing and sanitization that are critical to the application's data processing logic.
- Adding unit tests will ensure these functions behave as expected and prevent future regressions.

**Tasks:**

1.  **Inspect `util.py`:** Review the functions in `src/doughub2/util.py` to understand their inputs and expected outputs. The key functions are likely `parse_timestamp_for_path` and `sanitize_source_name`.
2.  **Populate `test_util.py`:** Open `tests/test_util.py` and add `pytest` test cases for each utility function.
3.  **Test `sanitize_source_name`:**
    - Write a test to ensure it correctly replaces spaces and invalid characters with underscores.
    - Write a test to ensure it handles names that are already clean.
    - Test with edge cases like leading/trailing spaces and consecutive invalid characters.
4.  **Test `parse_timestamp_for_path`:**
    - Write a test with a valid ISO timestamp string and verify it returns the correct year and month.
    - Write a test with a `None` or invalid timestamp string to ensure it correctly falls back to the current year and month.
5.  **Run Tests:** Execute the test suite to confirm that all new tests pass.

**Files to Inspect or Edit:**

- `tests/test_util.py` (Edit)
- `src/doughub2/util.py` (Inspect)

**Commands:**

- `poetry run pytest tests/test_util.py`

**Tests and Validation:**

1.  Run the pytest command and ensure all tests in `test_util.py` pass.
2.  Temporarily modify a utility function in `util.py` to return an incorrect value and confirm that the corresponding test fails, proving the tests are effective. Revert the change afterward.

**Exit Criteria:**

- [ ] `tests/test_util.py` is no longer empty and contains meaningful unit tests.
- [ ] The `sanitize_source_name` function is tested with various inputs.
- [ ] The `parse_timestamp_for_path` function is tested for both valid and fallback cases.
- [ ] All tests in the file pass successfully when run with `pytest`.

