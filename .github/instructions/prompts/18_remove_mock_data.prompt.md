
**Title:** STEP-018: Remove Obsolete Mock Data

**Goal:** Clean up the frontend codebase by deleting the `mockData.ts` file and ensuring no components are referencing it.

**Context:**

- Following the work in `16_connect_question_list_to_api.prompt.md` and `17_connect_question_view_to_api.prompt.md`, the application's frontend is now fully connected to the live backend API for question data.
- The placeholder data in `src/doughub2/ui/frontend/src/data/mockData.ts` is no longer needed and should be removed to maintain a clean codebase.

**Tasks:**

1.  **Verify No Usages:** Before deleting, run a search across the frontend codebase to confirm that no files are importing from `mockData.ts`. The only references should be the import statements that were removed in the previous steps.
2.  **Delete Mock Data File:** Delete the file `src/doughub2/ui/frontend/src/data/mockData.ts`.
3.  **Delete Data Directory:** If `mockData.ts` is the only file within the `src/doughub2/ui/frontend/src/data` directory, delete the now-empty `data` directory as well.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/data/mockData.ts` (Delete)
- `src/doughub2/ui/frontend/src/data` (Delete if empty)
- `src/doughub2/ui/frontend/src/` (Search for usages)

**Commands:**

1.  **Verify no usages (optional, but recommended):**
    ```bash
    grep -r "mockData" src/doughub2/ui/frontend/src/
    ```
    This command should return no results.

2.  **Delete the file and directory:**
    - Use your file explorer or standard shell commands (`rm` or `del`) to delete the file and directory.

**Tests and Validation:**

1.  After deleting the file (and directory), run the frontend application (`npm run dev --prefix src/doughub2/ui/frontend`).
2.  Navigate through the application, from the question list to the question view.
3.  Confirm that the application still works correctly and that all question data is being loaded from the API.
4.  Ensure the frontend application compiles without any "module not found" errors related to `mockData.ts`.

**Exit Criteria:**

- [ ] The file `src/doughub2/ui/frontend/src/data/mockData.ts` has been deleted.
- [ ] The directory `src/doughub2/ui/frontend/src/data` has been deleted if it became empty.
- [ ] A search for "mockData" within the `src/doughub2/ui/frontend/src/` directory yields no results.
- [ ] The application runs correctly without the mock data file.
