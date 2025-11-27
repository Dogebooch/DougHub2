---

**Title:** STEP-004: Implement Extraction Button Logic and Validation

**Goal:** Wire up the `FloatingActionButton` to perform the actual extraction process. This includes adding site configuration validation, calling the backend API, and handling success or error states based on the API response.

**Context:**

- This task builds upon `STEP-003`, where the `FloatingActionButton` component was created. The button's visual states should now be driven by real logic.
- The implementation logic must mirror the validation and operational flow from the original `question_extractor.user.js` script, specifically the `handleExtraction` function.
- The button will communicate with the FastAPI backend endpoint at `/api/extraction` (or the equivalent endpoint defined in previous steps).
- This prompt focuses on making the button a "controlled" component, with its state managed by the parent layout.

**Tasks:**

1.  **Create Site Configuration File:**
    - In a new directory, create the file `src/config/siteConfigs.ts`.
    - Port the `siteConfigs` object from the original userscript into this file. This object maps hostnames to site-specific metadata.
    - `export const siteConfigs = { "www.acep.org": { siteName: "ACEP PeerPrep" }, "learn.acep.org": { siteName: "ACEP PeerPrep" }, "mksap.acponline.org": { siteName: "MKSAP 19" }, "mksap19.acponline.org": { siteName: "MKSAP 19" } };`

2.  **Refactor `FloatingActionButton`:**
    - Modify `src/components/ui/FloatingActionButton.tsx` to be a fully controlled component.
    - It should no longer manage its own state. Instead, it should accept its `status` and an `onClick` handler via props from its parent.

3.  **Implement Handler Logic in Main Layout:**
    - In the main layout component (`src/App.tsx` or equivalent), implement the primary `handleExtraction` async function.
    - **Add State Management:** Use `useState` to manage the button's `status` and visibility.
    - **Conditional Rendering:** Read the current hostname from `window.location.hostname`. The `FloatingActionButton` should only be rendered if the hostname is a key in the imported `siteConfigs` object.
    - **Implement `onClick` Handler:**
        - When the button is clicked, first set the status to `'processing'`.
        - Prepare the payload for the backend: `{ url: window.location.href }`.
        - Use the native `fetch` API to send a `POST` request to the `/api/extraction` endpoint.
        - **API Response Validation:**
            - If `response.ok` is `true` (status 200-299), set the button status to `'success'`.
            - Otherwise, or if the `fetch` call throws an error, set the button status to `'error'`.
        - **State Reset:** In both success and error cases, use `setTimeout` to reset the button's status to `'idle'` after 3 seconds.

**Files to Inspect or Edit:**

- `src/components/ui/FloatingActionButton.tsx` (Edit)
- `src/App.tsx` (or the project's main layout component) (Edit)
- `src/config/siteConfigs.ts` (Create)
- `.github/instructions/prompts/03_add_extraction_button.prompt.md` (Inspect for context)

**Commands:**

- `npm run dev` (to run the development server for testing)

**Tests and Validation:**

1.  Start the application.
2.  Navigate to a URL whose hostname is **not** in `siteConfigs.ts`. The floating button should **not** be visible.
3.  Navigate to a URL whose hostname **is** in `siteConfigs.ts` (e.g., `https://www.acep.org/some-path`). The button should be visible and in its 'idle' state.
4.  Click the button. It should immediately change to the 'processing' state.
5.  **Success Case:** If the backend responds with a 200-level status, the button should change to the 'success' state, and then revert to 'idle' after 3 seconds.
6.  **Failure Case:** If the backend responds with an error (e.g., 500) or is unavailable, the button should change to the 'error' state, and then revert to 'idle' after 3 seconds.

**Exit Criteria:**

- [ ] A `src/config/siteConfigs.ts` file is created and populated.
- [ ] The `FloatingActionButton` is refactored into a controlled component.
- [ ] The button is only rendered when the user is on a supported website.
- [ ] Clicking the button correctly triggers a `fetch` call to the backend.
- [ ] The button's visual state (`processing`, `success`, `error`, `idle`) accurately reflects the lifecycle of the API call.
- [ ] The implementation adheres to the guardrail of using `fetch` and not external request libraries.
---
