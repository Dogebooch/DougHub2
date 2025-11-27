---

**Title:** STEP-08: Add Integration Test for Extraction File Output

**Goal:** Create an integration test that verifies the `/extract` endpoint correctly saves a JSON file with the expected content, and refactor the app's configuration to make this test clean and isolated.

**Context:**

- To properly test endpoints that have side effects (like writing files), we must isolate those side effects during the test run.
- The best way to achieve this is to make the output directory configurable.
- We will implement this by refactoring the configuration system to use Pydantic's `BaseSettings`, which can be easily overridden in tests via environment variables. This also modernizes our configuration management, which was a previously identified cleanup task.

**Tasks:**

1.  **Add Pydantic Settings Dependency:**
    - Pydantic's `BaseSettings` requires an extra dependency. Run the command: `poetry add pydantic-settings`.

2.  **Refactor `config.py` for Pydantic Settings:**
    - Open `src/doughub2/config.py` and remove the old YAML-based `load_config` logic.
    - Define a new class for settings:
      ```python
      from pathlib import Path
      from pydantic_settings import BaseSettings, SettingsConfigDict

      class Settings(BaseSettings):
          model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

          # Directory for saving extractions
          EXTRACTION_DIR: Path = Path("extractions")

      settings = Settings()
      ```
    - This sets up a default `EXTRACTION_DIR` but allows it to be overridden by an environment variable of the same name.

3.  **Update `main.py` to Use New Settings:**
    - In `src/doughub2/main.py`, find the `extract_questions` function (the `/extract` endpoint).
    - Import the `settings` object from `doughub2.config`.
    - Modify the file-saving logic to use `settings.EXTRACTION_DIR` as the base path for constructing the output directory, instead of a hardcoded string.

4.  **Write the Integration Test:**
    - In `tests/test_api.py`, add a new test function: `test_extract_endpoint_saves_valid_file`.
    - This function should take two `pytest` fixtures: `client: TestClient` and `tmp_path: Path`.
    - **Override Config via Monkeypatch:** At the start of the test, use `monkeypatch.setenv("EXTRACTION_DIR", str(tmp_path))`. Pytest automatically provides the `monkeypatch` fixture.
    - **Define Payload:** Create a sample JSON payload dictionary for the request body. It must include `timestamp` and `siteName` (e.g., `"2025-12-01T12:00:00Z"` and `"Test Site"`).
    - **Make API Call:** Use `client.post("/extract", json=payload)` to call the endpoint. Assert that the response status code is 200.
    - **Check for Output:** The test needs to find the file created in the `tmp_path` directory. Since the filename is dynamic, you can scan the directory for the newly created `.json` file. The directory structure will be `<tmp_path>/<siteName>/<year>/<month>/`.
    - **Assert File Content:** Once the file is found, load it as JSON and assert that its contents are correct. For example, `assert data["siteName"] == payload["siteName"]`.

**Files to Inspect or Edit:**

- `src/doughub2/config.py` (Edit)
- `src/doughub2/main.py` (Edit)
- `tests/test_api.py` (Edit)
- `pyproject.toml` (to confirm `pydantic-settings` is added)

**Commands:**

- `poetry add pydantic-settings`
- `poetry run pytest`

**Tests and Validation:**

1.  After adding the `pydantic-settings` dependency, inspect `pyproject.toml` to ensure it's listed.
2.  Run `poetry run pytest`.
3.  The test suite should pass, including the new `test_extract_endpoint_saves_valid_file`.
4.  Verify that the test does **not** create any files or folders inside the project's main `extractions` directory. All file artifacts from the test run must be confined to pytest's temporary directory management.

**Exit Criteria:**

- [ ] `pydantic-settings` is added as a project dependency.
- [ ] `config.py` is refactored to use a Pydantic `Settings` class.
- [ ] The `/extract` endpoint in `main.py` uses the new settings object to determine the output directory.
- [ ] A new integration test in `test_api.py` successfully verifies the creation and content of the JSON output file.
- [ ] The new test runs cleanly, using a temporary directory for file I/O, and leaves no artifacts behind.
---
