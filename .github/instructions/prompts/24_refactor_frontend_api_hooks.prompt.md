
**Title:** STEP-024: Refactor Frontend API Calls into a Reusable Hook

**Goal:** Abstract the data-fetching logic from the `QuestionListPage` and `QuestionViewPage` components into a single, reusable custom React hook.

**Context:**

- Currently, both `QuestionListPage` and `QuestionViewPage` implement their own `fetch` logic using `useState` and `useEffect`. This leads to code duplication.
- Creating a custom hook (e.g., `useApi`) will centralize the logic for data fetching, loading state management, and error handling, making the components cleaner and the fetching logic reusable.

**Tasks:**

1.  **Create Hooks Directory:** Create a new directory at `src/doughub2/ui/frontend/src/hooks`.
2.  **Create `useApi.ts` Hook:**
    - Inside the new `hooks` directory, create a file named `useApi.ts`.
    - This hook should accept a URL as an argument.
    - It should manage three states: `data`, `isLoading`, and `error`.
    - Use a `useEffect` hook to perform the `fetch` call whenever the URL argument changes.
    - The hook should handle setting the loading state, updating the data on a successful response, and capturing any errors.
    - It should return an object containing `{ data, isLoading, error }`.
3.  **Refactor `QuestionListPage.tsx`:**
    - Replace the existing `useState` and `useEffect` logic for data fetching with the new `useApi` hook.
    - Pass the `/api/questions/` endpoint URL to the hook.
    - Use the `data`, `isLoading`, and `error` values returned from the hook to render the component.
4.  **Refactor `QuestionViewPage.tsx`:**
    - Do the same for this component, replacing its fetching logic with the `useApi` hook.
    - Construct the URL dynamically using the `questionId` from `useParams` (e.g., `/api/questions/${questionId}`).
    - The `useEffect` in the `useApi` hook will automatically refetch when this URL changes.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/hooks/useApi.ts` (Create)
- `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx` (Edit)
- `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx` (Edit)

**Commands:**

- No new packages are required. Run the frontend development server to test.
- `npm run dev --prefix src/doughub2/ui/frontend`

**Tests and Validation:**

1.  After refactoring, run the frontend and backend servers.
2.  Navigate to the question list page. Verify that the loading state appears and questions are displayed correctly.
3.  Click a question to navigate to the detail page. Verify its data is fetched and displayed correctly.
4.  Manually test an invalid URL to ensure the error state is handled by the hook and reflected in the component.
5.  Confirm that the code in both page components is significantly simplified.

**Exit Criteria:**

- [ ] The `useApi.ts` custom hook exists and contains all generic data-fetching logic.
- [ ] `QuestionListPage.tsx` uses the `useApi` hook and has its previous fetching logic removed.
- [ ] `QuestionViewPage.tsx` uses the `useApi` hook and has its previous fetching logic removed.
- [ ] The application remains fully functional, with all data-loading features working as before.
- [ ] Code duplication for data fetching has been eliminated.

