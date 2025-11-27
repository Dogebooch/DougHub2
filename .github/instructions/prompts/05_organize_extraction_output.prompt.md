---

**Title:** STEP-005: Organize Extraction Output Files

**Goal:** Modify the backend API to save extracted JSON files into a hierarchical directory structure, organizing them by source, year, and month.

**Context:**

- The current implementation saves all extractions to a single, flat `extractions/` directory, which is not scalable.
- The new, approved directory structure is: `extractions/<Source>/<Year>/<Month>/<Filename>.json`.
- This change will affect the file-saving logic within the `/extract` endpoint, located in `src/doughub2/api/extraction.py`.
- The data required for this structure (`siteName` and `timestamp`) is already available in the payload sent from the frontend.

**Tasks:**

1.  **Locate File-Saving Logic:** In `src/doughub2/api/extraction.py`, find the section within the `/extract` endpoint responsible for writing the received JSON payload to a file.

2.  **Modify the Endpoint Logic:**
    - **Extract Date Parts:** From the `timestamp` field in the JSON payload (e.g., `"2025-11-27T21:30:00.123Z"`), parse the date to get the year and month. Python's `datetime` module should be used for this.
    - **Sanitize Source Name:** The `siteName` from the payload (e.g., "MKSAP 19") must be sanitized to create a valid directory name (e.g., "MKSAP_19"). Replace spaces and other invalid characters with underscores.
    - **Construct Directory Path:** Use `pathlib.Path` to build the target directory path: `extractions/<SanitizedSource>/<Year>/<Month>`.
    - **Create Directories:** Before writing the file, ensure the full directory path exists by calling `path.mkdir(parents=True, exist_ok=True)`.
    - **Update File Path:** Combine the new directory path with the original filename to create the full destination path for the output file.
    - **Save the File:** Update the file-write operation to use this new, full path.

3.  **Update .gitignore:**
    - Add the `extractions/` directory to the project's `.gitignore` file. This ensures that the generated data files are not tracked by version control.

**Files to Inspect or Edit:**

- `src/doughub2/api/extraction.py` (Edit)
- `.gitignore` (Edit)

**Commands:**

- To test the endpoint: `poetry run uvicorn doughub2.main:app --reload`

**Tests and Validation:**

1.  Start the backend server.
2.  Send a POST request to the `/extract` endpoint. The payload must contain `timestamp` and `siteName` fields, for example:
    ```json
    {
      "timestamp": "2025-11-27T14:50:33.000Z",
      "siteName": "ACEP PeerPrep",
      "pageHTML": "..."
    }
    ```
3.  **Verify File Creation:** Check the filesystem to confirm that the JSON file was created in the correct hierarchical directory, for example: `extractions/ACEP_PeerPrep/2025/11/20251127_145033_ACEP_PeerPrep_0.json` (assuming the filename format from the original user prompt).
4.  **Verify .gitignore:** Open the `.gitignore` file and confirm that a new line for `extractions/` has been added.

**Exit Criteria:**

- [ ] The `/extract` endpoint now saves files into the `extractions/<Source>/<Year>/<Month>/` structure.
- [ ] The `siteName` is correctly sanitized to create a valid directory name.
- [ ] The nested directory structure is created automatically if it doesn't exist.
- [ ] The `extractions/` directory is successfully added to `.gitignore`.
---
