
**Title:** STEP-017: Connect Question View Page to Live API

**Goal:** Refactor the `QuestionViewPage` to fetch and display the full details of a single question from the backend API, using the question ID from the URL.

**Context:**

- The `QuestionViewPage` currently displays details from a hardcoded question found in `mockData.ts`.
- The backend provides an endpoint to get a single question by its ID at `/api/questions/{question_id}`, as implemented in `11_add_get_question_endpoint.prompt.md`.
- This task requires using the `useParams` hook from `react-router-dom` to extract the question ID from the URL and fetch the corresponding data.

**Tasks:**

1.  **Remove Mock Data:** In `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx`, remove the logic that finds a question in the `mockExtractedQuestions` array.
2.  **Get Question ID from URL:** Use the `useParams` hook to get the `questionId` from the URL parameters.
3.  **Implement State:** Use `useState` to manage the state for the individual question (`question`), loading status (`isLoading`), and errors (`error`).
4.  **Fetch Data on Mount/ID Change:** Use the `useEffect` hook to fetch the specific question from `/api/questions/{questionId}`. The effect should run whenever the `questionId` parameter changes.
5.  **API Call Logic:**
    - Before fetching, set `isLoading` to `true`.
    - If the `questionId` is not available, do not fetch.
    - On a successful fetch, update the `question` state with the response data and set `isLoading` to `false`.
    - In case of an error, set the `error` state and set `isLoading` to `false`.
6.  **Conditional Rendering:**
    - If `isLoading` is `true`, render a "Loading question..." message.
    - If an `error` occurs, render an error message.
    - If the `question` is not found (i.e., null), render a "Question not found" message.
    - If the `question` data is present, render the `QuestionPanel` with the fetched data.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx` (Edit)
- `src/doughub2/ui/frontend/src/App.tsx` (Inspect for route parameter setup, e.g., `/question/:questionId`)
- `src/doughub2/ui/frontend/src/types/index.ts` (Inspect for `ExtractedQuestion` type)
- `src/doughub2/main.py` (Inspect for API endpoint confirmation)

**Commands:**

- No new packages are required. Run the frontend and backend servers to test.
- Backend: `poetry run uvicorn src.doughub2.main:app --reload`
- Frontend: `npm run dev --prefix src/doughub2/ui/frontend`

**Tests and Validation:**

1.  Run both the backend and frontend development servers.
2.  From the main question list, click on a question.
3.  Verify the URL changes to `/question/some-id`.
4.  **Visual Check:** Confirm the `QuestionViewPage` displays a "Loading question..." message with `text-primary` color.
5.  **Data Check:** After loading, verify the `QuestionPanel` shows the full details for the selected question, fetched from `/api/questions/some-id`.
6.  **Visual Check:** The `QuestionPanel` should have a `bg-card` background (`#2F3A48`).
7.  **Visual Check:** The main question text inside the panel should use `text-primary` (`#F0DED3`), and ancillary details like the source URL or timestamp should use `text-secondary` (`#A79385`).
8.  Test with an invalid ID in the URL (e.g., `/question/invalid-id`) and verify that a "Question not found" or error message is displayed with `text-primary` color.

**Exit Criteria:**

- [ ] `QuestionViewPage.tsx` no longer uses mock data.
- [ ] The component uses `useParams` to get the question ID from the URL.
- [ ] The view correctly displays styled loading, error, and "not found" states.
- [ ] The full details of the correct question are rendered on the page.
- [ ] The `QuestionPanel` and its text elements render correctly with the specified dark theme colors (`bg-card`, `text-primary`, `text-secondary`).
- [ ] All debugging statements (`console.log`) have been removed.
