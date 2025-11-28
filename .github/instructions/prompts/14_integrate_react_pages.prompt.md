---

**Title:** STEP-014: Integrate Pages with a Router

**Goal:** Integrate the newly created `QuestionListPage` and `QuestionViewPage` components into the main application using a client-side router, enabling navigation between the list and detail views.

**Context:**

- The frontend is a React application in `src/doughub2/ui/frontend`.
- The `QuestionListPage` and `QuestionViewPage` components were created in previous steps.
- The application currently lacks a proper navigation system. `react-router-dom` is the standard library for routing in React.

**Tasks:**

1.  **Install React Router:**
    - In the `src/doughub2/ui/frontend` directory, add `react-router-dom` as a dependency.

2.  **Set up the Router:**
    - In `src/doughub2/ui/frontend/src/main.tsx`, wrap the `<App />` component with `<BrowserRouter>` from `react-router-dom`.

3.  **Define Application Routes:**
    - In `src/doughub2/ui/frontend/src/App.tsx`, import `Routes`, `Route` from `react-router-dom`.
    - Also import the `QuestionListPage` and `QuestionViewPage` components.
    - Inside the main `div`, replace the existing content with the router configuration.
    - Define a route for the root path (`/`) that renders the `QuestionListPage`.
    - Define another route for `/question/:questionId` that renders the `QuestionViewPage`.

4.  **Update List Page Links:**
    - In `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx`, import the `Link` component from `react-router-dom`.
    - Replace the placeholder anchor tags (`<a>`) around each list item with the `Link` component, directing it to `/question/${question.question_id}`.

5.  **Update Detail Page Parameter Handling:**
    - In `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx`, import the `useParams` hook from `react-router-dom`.
    - Use `useParams` to retrieve the `questionId` from the URL, replacing the previous `window.location.hash` implementation.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/package.json`
- `src/doughub2/ui/frontend/src/main.tsx`
- `src/doughub2/ui/frontend/src/App.tsx`
- `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx`
- `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx`

**Commands:**

- `npm install react-router-dom` (run inside `src/doughub2/ui/frontend`)
- `npm run dev`

**Tests and Validation:**

1.  Start the backend and frontend servers.
2.  Navigate to `http://localhost:5173`. You should see the list of questions.
3.  Click on a question in the list.
4.  Verify that the URL changes to `/question/ID` and that the `QuestionViewPage` for the correct question is displayed.
5.  Use the browser's back button to navigate back to the question list.

**Exit Criteria:**

- [ ] `react-router-dom` is added as a dependency.
- [ ] The application has two routes: one for the list and one for the detail view.
- [ ] Users can navigate from the question list to the detail view by clicking a link.
- [ ] The `QuestionViewPage` correctly extracts the `questionId` from the URL using `useParams`.
- [ ] The application is a Single Page Application (SPA) and does not fully reload when navigating between pages.

---
