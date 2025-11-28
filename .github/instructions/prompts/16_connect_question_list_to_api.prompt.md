
**Title:** STEP-016: Connect Question List Page to Live API

**Goal:** Refactor the `QuestionListPage` to fetch and display real question data from the backend API, replacing the current placeholder mock data.

**Context:**

- The frontend currently uses static mock data from `src/doughub2/ui/frontend/src/data/mockData.ts`.
- The backend provides a live list of questions at the `/api/questions/` endpoint, as implemented in `10_add_list_questions_endpoint.prompt.md`.
- This task involves removing the dependency on mock data in the `QuestionListPage` and replacing it with a `fetch` call to the live API.

**Tasks:**

1.  **Remove Mock Data Import:** In `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx`, delete the import statement for `mockExtractedQuestions`.
2.  **Implement State for Questions:** Use the `useState` hook to manage the list of questions. The state should be initialized with an empty array.
3.  **Fetch Data on Mount:** Use the `useEffect` hook to fetch the list of questions from the `/api/questions/` endpoint when the component mounts.
4.  **Update State with Fetched Data:** Once the data is fetched successfully, update the component's questions state with the response.
5.  **Handle Loading State:** Implement a simple loading state to provide feedback to the user while the data is being fetched. Display a message like "Loading questions...".
6.  **Error Handling:** Add basic error handling to the `fetch` call. If an error occurs, log it to the console and display an error message to the user.
7.  **Update Render Logic:** Modify the component's return statement to render the list of questions from the state, not the mock data. Ensure the `QuestionSidebar` is correctly populated.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx` (Edit)
- `src/doughub2/ui/frontend/src/types/index.ts` (Inspect for `ExtractedQuestion` type)
- `src/doughub2/main.py` (Inspect for API endpoint confirmation)
- `src/doughub2/ui/frontend/src/data/mockData.ts` (For reference, will be removed in a later step)

**Commands:**

- No new packages are required. Run the frontend and backend servers to test.
- Backend: `poetry run uvicorn src.doughub2.main:app --reload`
- Frontend: `npm run dev --prefix src/doughub2/ui/frontend`

**Tests and Validation:**

1.  Run both the backend and frontend development servers.
2.  Open the application in a browser and navigate to the Questions list page (`/`).
3.  **Visual Check:** The page background should use the `bg-base` color (`#2C3134`).
4.  **Visual Check:** Verify that the page initially shows a "Loading questions..." message with `text-primary` color (`#F0DED3`).
5.  **Data Check:** Confirm that the list of questions fetched from the `/api/questions/` endpoint is displayed in the `QuestionSidebar`.
6.  **Visual Check:** Inside the sidebar, each question link should have `text-primary` color. The overall sidebar can maintain its base background color.
7.  Check the browser's developer console to ensure there are no data fetching or rendering errors.

**Exit Criteria:**

- [ ] `QuestionListPage.tsx` no longer imports `mockExtractedQuestions`.
- [ ] The component uses `useState` and `useEffect` to fetch and store question data.
- [ ] A styled loading message is displayed while data is being fetched.
- [ ] Questions displayed on the page are from the live `/api/questions/` API endpoint.
- [ ] The `QuestionSidebar` and its contents render correctly with the specified dark theme colors (`bg-base`, `text-primary`).
- [ ] All debugging statements (`console.log`) have been removed.
