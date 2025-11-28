
**Title:** STEP-019: Sanitize Rendered HTML in Frontend

**Goal:** Fix a potential Cross-Site Scripting (XSS) vulnerability by sanitizing the `raw_html` from the API before it is rendered in the `QuestionViewPage` component.

**Context:**

- A `TODO` comment exists in `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx` indicating the need for HTML sanitization.
- Rendering HTML directly from an API using `dangerouslySetInnerHTML` is unsafe without proper sanitization, as it can expose the application to XSS attacks.
- We will use the `dompurify` library, a standard and trusted tool for this purpose.

**Tasks:**

1.  **Install Dependencies:** Add `dompurify` and its corresponding TypeScript types to the frontend project.
2.  **Import DOMPurify:** In `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx`, import the `dompurify` library.
3.  **Sanitize HTML:** In the `QuestionViewPage` component, before rendering the question's `raw_html`, process it with `DOMPurify.sanitize()`.
4.  **Update Render Logic:** Ensure the sanitized HTML, and not the raw HTML, is passed to the `dangerouslySetInnerHTML` prop.
5.  **Remove TODO:** Delete the `// TODO: Sanitize HTML...` comment now that the task is complete.

**Files to Inspect or Edit:**

- `src/doughub2/ui/frontend/src/pages/QuestionViewPage.tsx` (Edit)
- `src/doughub2/ui/frontend/package.json` (Edit)

**Commands:**

1.  **Install packages:**
    ```bash
    npm install dompurify --prefix src/doughub2/ui/frontend
    npm install @types/dompurify --save-dev --prefix src/doughub2/ui/frontend
    ```

**Tests and Validation:**

1.  Run the frontend and backend development servers.
2.  Navigate to a question detail page.
3.  Verify that the question's HTML content still renders correctly (e.g., bold text, paragraphs, images).
4.  **Security Test (Conceptual):** Confirm that if a question's `raw_html` contained a `<script>alert('XSS')</script>` tag, the script would not execute when the page is viewed. The tag should be stripped out by DOMPurify.
5.  Check the browser's developer console for any new errors.

**Exit Criteria:**

- [ ] `dompurify` and `@types/dompurify` are added to `package.json`.
- [ ] `QuestionViewPage.tsx` imports and uses `DOMPurify.sanitize()` on the `raw_html`.
- [ ] The `TODO` comment regarding sanitization is removed.
- [ ] The application renders HTML content correctly and safely.
- [ ] The application compiles without errors.

