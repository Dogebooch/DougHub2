---

**Title:** STEP-013: Create Question Detail View Page

**Goal:** Create a new page component in the React frontend that fetches and displays the full `raw_html` content of a single, selected question.

**Context:**

- The frontend is a React application in `src/doughub2/ui/frontend`.
- An endpoint `GET /api/questions/{question_id}` will be available to fetch question details.
- A `QuestionListPage` component was created in a previous step, which will link to this new page.
- The UI must adhere to the dark theme colors from the project's guardrails.

**Tasks:**

1.  **Create a New Page Component:**
    - In the `src/doughub2/ui/frontend/src/pages` directory, create a new file named `QuestionViewPage.tsx`.

2.  **Implement the Question View Logic:**
    - In `QuestionViewPage.tsx`, create a React functional component `QuestionViewPage`.
    - The component needs to get the `question_id` from the URL. For now, use a simple hash-based approach. Assume the URL will be like `http://host/#/question/123`. You can parse the ID from `window.location.hash`.
    - Use `useState` and `useEffect` to fetch the question details from `GET /api/questions/{question_id}` when the component mounts or the ID changes.
    - Define a simple interface for the `QuestionDetail` with `question_id`, `source_name`, `raw_html`, etc.

3.  **Render the Question Content:**
    - If the data is loading, display a "Loading..." message.
    - If there is an error (e.g., question not found), display an appropriate error message.
    - If the question is loaded, display the `source_name` as a title.
    - **Crucially, render the `raw_html` content.** Since this is HTML from an external source, it must be handled carefully to prevent XSS attacks. Use a `div` and the `dangerouslySetInnerHTML` prop. Add a comment warning about the XSS risk and that this is a temporary solution. A later step will involve sanitizing the HTML.

4.  **Style the Component:**
    - Use Tailwind CSS to style the page according to the project's dark theme.
    - The container for the rendered HTML should be styled to look like a card or a distinct content area (e.g., using `bg-card`).
    - Ensure the text within the rendered HTML is readable against the dark background. You might need to apply some base text color styles to the container.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx` (Create)

**Commands:**

- `npm run dev`

**Tests and Validation:**

1.  To test this, you will need to temporarily modify `App.tsx` to render this component and pass a `question_id` via the URL hash.
2.  Start the backend and frontend servers.
3.  Navigate to `http://localhost:5173/#/question/1` (assuming a question with ID 1 exists).
4.  Verify that the component loads and displays the `raw_html` content for the specified question.
5.  Test the loading and error states by using an invalid ID.

**Exit Criteria:**

- [ ] The file `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx` is created.
- [ ] The `QuestionViewPage` component fetches data from `/api/questions/{question_id}` based on the URL hash.
- [ ] The component renders the external `raw_html` content.
- [ ] The component is styled according to the project's dark theme.

---
