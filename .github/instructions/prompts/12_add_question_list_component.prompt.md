---

**Title:** STEP-012: Create Question List Page

**Goal:** Create a new page in the React frontend that fetches and displays a list of all extracted questions from the backend.

**Context:**

- The frontend is a React application located in `src/doughub2/ui/frontend`.
- API calls are made using the native `fetch` API.
- The Vite development server is configured to proxy requests from `/api` to the backend server at `http://localhost:5000`.
- The UI must adhere to the dark theme colors defined in `gemini.instructions.md`.
- An endpoint `GET /questions` to fetch the questions will be created in a previous step.

**Tasks:**

1.  **Create a New Page Component:**
    - Create a new directory `src/doughub2/ui/frontend/src/pages`.
    - Inside this new directory, create a file named `QuestionListPage.tsx`.

2.  **Implement the Question List Logic:**
    - In `QuestionListPage.tsx`, create a new React functional component called `QuestionListPage`.
    - Use the `useState` hook to manage the state for the list of questions and any potential loading or error states.
    - Use the `useEffect` hook to fetch the list of questions from the `GET /api/questions` endpoint when the component mounts.
    - For now, define a simple interface for the `QuestionInfo` with `question_id`, `source_name`, and `source_question_key`.

3.  **Render the Question List:**
    - If the data is loading, display a "Loading..." message.
    - If there is an error, display an error message.
    - If the questions are loaded successfully, render them as an unordered list (`<ul>`).
    - Each question in the list should be a list item (`<li>`) and display the `source_name` and `source_question_key`.
    - Each list item should be a link that will eventually navigate to the detail page for that question. For now, the `href` can be a placeholder (e.g., `#/question/${question.question_id}`).

4.  **Style the Component:**
    - Apply basic styling using Tailwind CSS classes, consistent with the existing `App.tsx` component and the dark theme colors from the project's guardrails.
    - Use `bg-base` for the page background, `text-primary` for text, and other theme colors as appropriate.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx` (Create)

**Commands:**

- `npm install` (if not already done)
- `npm run dev` (to start the frontend development server)

**Tests and Validation:**

1.  After creating the component, you will need to temporarily import and render it in `src/doughub2/ui/frontend/src/App.tsx` to see it.
2.  Start the backend server (`poetry run doughub2 serve`).
3.  Start the frontend server (`npm run dev` inside `src/doughub2/ui/frontend`).
4.  Open the browser to `http://localhost:5173`.
5.  Verify that the `QuestionListPage` component is rendered.
6.  Verify that it shows a "Loading..." message initially.
7.  Verify that it then displays the list of questions fetched from the backend.

**Exit Criteria:**

- [ ] The file `src/doughub2/ui/frontend/src/pages/QuestionListPage.tsx` is created.
- [ ] The `QuestionListPage` component fetches data from `/api/questions`.
- [ ] The component displays a list of questions.
- [ ] The component is styled according to the project's dark theme.

---
