**Title:** STEP-029: Connect Card Preview to Live Detail API

**Goal:** To enhance the `CardPreview` component to fetch and display the full, detailed content of a selected card from the backend, including the HTML content for the "back" of the card. This replaces the placeholder data with a live API call.

**Context:**

*   The `BrowserScreen.tsx` component features a `CardPreview` pane that shows details of the `focusedCard`.
*   Currently, the preview pane only shows the limited data available in the `Card` object from the main list.
*   The backend provides a detailed question endpoint at `/api/questions/{question_id}` which returns the full `raw_html`.
*   The `useApi` hook should be used to fetch this detail data when a card is selected.
*   The fetched HTML must be sanitized using `DOMPurify` before being rendered to prevent security vulnerabilities.

**Tasks:**

1.  **Define API Detail Type:** First, update `src/doughub2/ui/frontend/src/types/index.ts` to include the type for the detailed question API response.

    ```typescript
    // Add this new interface to the bottom of the file
    export interface QuestionDetailResponse {
        question_id: number;
        source_name: string;
        source_question_key: string;
        raw_html: string;
    }
    ```

2.  **Fetch Details in `CardPreview.tsx`:**
    *   Open `src/doughub2/ui/frontend/src/components/CardPreview.tsx`.
    *   Import `useApi`, `QuestionDetailResponse`, `API_ENDPOINTS`, and `DOMPurify`.
    *   Inside the `CardPreview` component, add a call to the `useApi` hook. This hook will be triggered whenever the `card` prop changes.

    ```typescript
    // Add this hook near the top of the CardPreview component function
    const { data: questionDetail, isLoading } = useApi<QuestionDetailResponse>(
        card ? API_ENDPOINTS.questionDetail(card.id) : null
    );
    ```

3.  **Render Sanitized HTML for Card Back:**
    *   Locate the "Back of Card" section in the JSX.
    *   Modify the logic that currently shows `card.back`.
    *   When `showBack` is true, it should now display a loading indicator if `isLoading` is true.
    *   If `questionDetail` is available, sanitize its `raw_html` content and render it using `dangerouslySetInnerHTML`.
    *   If there's no data, it should show a message indicating that.

    ```tsx
    // Find this block:
    // <div className={`p-4 rounded-lg border transition-all ${...}`}>
    //   {showBack ? (
    //     <p className="text-[#F0DED3]">{card.back}</p>
    //   ) : (
    //     <p className="text-[#858A7E] italic">Click "Show Answer" to reveal</p>
    //   )}
    // </div>
    //
    // And replace it with this new logic:
    <div className={`p-4 rounded-lg border transition-all min-h-[100px] ${
        showBack
            ? 'bg-[#254341] border-[#759194]'
            : 'bg-[#09232A] border-[#506256]'
    }`}>
        {showBack ? (
            <>
                {isLoading && <p className="text-[#A79385]">Loading...</p>}
                {questionDetail && (
                    <div
                        className="prose prose-sm prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(questionDetail.raw_html) }}
                    />
                )}
                {!isLoading && !questionDetail && <p className="text-[#858A7E]">No additional details available.</p>}
            </>
        ) : (
            <p className="text-[#858A7E] italic">Click "Show Answer" to reveal</p>
        )}
    </div>
    ```

    *(Note: You may need to install a typography plugin for Tailwind if `prose` classes are not already available, e.g., `@tailwindcss/typography`)*


**Files to Inspect or Edit:**

*   `src/doughub2/ui/frontend/src/components/CardPreview.tsx` (Edit)
*   `src/doughub2/ui/frontend/src/types/index.ts` (Edit)
*   `src/doughub2/ui/frontend/src/config/apiConfig.ts` (Inspect)

**Commands:**

1.  `npm run dev --prefix src/doughub2/ui/frontend` (to run the dev server and test the changes)

**Tests and Validation:**

1.  Run the frontend application and select a card from the `CardTable`.
2.  The `CardPreview` component should appear.
3.  Click the "Show Answer" button.
4.  A "Loading..." message should appear briefly.
5.  The back of the card should render the full HTML content fetched from `/api/questions/{question_id}`.
6.  Verify that the HTML is rendered correctly and not as plain text.

**Exit Criteria:**

- [ ] `CardPreview.tsx` uses the `useApi` hook to fetch detailed question data when a card is selected.
- [ ] The `raw_html` from the API response is sanitized with `DOMPurify`.
- [ ] The sanitized HTML is correctly rendered as the back of the card.
- [ ] A loading indicator is shown while the detail data is being fetched.
- [ ] The `types/index.ts` file is updated with the `QuestionDetailResponse` interface.

---
I am now creating the prompt file as `29_connect_question_view_to_api.prompt.md`.
Following this, I will create one more prompt to clean up the `BrowserScreen.tsx` component, removing the leftover mock data and consolidating the component's logic.
Are you happy for me to proceed?