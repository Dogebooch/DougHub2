
**Title:** STEP-026: Centralize Frontend API Configuration

**Goal:** Improve frontend maintainability by moving hardcoded API endpoint URLs into a single, centralized configuration file.

**Context:**

- API endpoint URLs like `/api/questions/` are currently hardcoded directly within the components that use them.
- This practice makes it difficult to update API paths, especially as the application grows. Centralizing them is a standard best practice.

**Tasks:**

1.  **Create Config File:**
    - In the `src/doughub2/ui/frontend/src/config` directory, create a new file named `apiConfig.ts`.
2.  **Define API Endpoints:**
    - In `apiConfig.ts`, define and export an object (e.g., `API_ENDPOINTS`) that holds all API URLs.
    - Start by defining the base URL for the API (e.g., `/api`).
    - Add properties for each endpoint, such as `questionsList: `${BASE_URL}/questions/`` and a function for dynamic endpoints like `questionDetail: (id) => `${BASE_URL}/questions/${id}``.
3.  **Update `useApi.ts` Hook:**
    - Modify the `useApi` hook (created in a previous step) to accept the endpoint key or a fully-formed URL.
    - If it's a key, it should look it up in the `API_ENDPOINTS` object. This is a more advanced step; for simplicity, we will just import the config object in the components and pass the URL to the hook.
4.  **Refactor Page Components:**
    - In `QuestionListPage.tsx` and `QuestionViewPage.tsx`, import the `API_ENDPOINTS` object.
    - Instead of using a hardcoded string for the URL, use the values from the imported configuration object when calling the `useApi` hook. For `QuestionViewPage`, call the function to generate the dynamic URL.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/config/apiConfig.ts` (Create)
- `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx` (Edit)
- `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx` (Edit)

**Commands:**

- No new packages are required.
- `npm run dev --prefix src/doughub2/ui/frontend`

**Tests and Validation:**

1.  Run the frontend and backend servers.
2.  Navigate through the application, viewing the question list and individual question pages.
3.  Confirm that all data is still fetched correctly.
4.  Inspect the browser's network tab to verify that the API calls are being made to the correct URLs as defined in `apiConfig.ts`.
5.  Check the browser console for any errors.

**Exit Criteria:**

- [ ] The file `apiConfig.ts` exists and contains all API endpoint definitions.
- [ ] No hardcoded API URLs remain in the page components.
- [ ] `QuestionListPage.tsx` and `QuestionViewPage.tsx` import and use the new API config.
- [ ] The application remains fully functional.

