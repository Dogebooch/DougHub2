**Title:** STEP-028: Connect Question List to Live API

**Goal:** To replace the mock card data in the `BrowserScreen` component with a live API call to the backend. This will involve fetching the list of questions, transforming the data to fit the frontend's `Card` model, and displaying it in the `CardTable`, with placeholder values for fields not yet supplied by the API.

**Context:**

*   The `BrowserScreen.tsx` component currently generates 1,000 mock cards using `generateMockCards`.
*   The `CardTable.tsx` component within `BrowserScreen.tsx` expects a `Card[]` array.
*   The backend provides a list of questions at the `/api/questions/` endpoint, returning a `QuestionListResponse` object.
*   There's a data mismatch between the backend's `QuestionInfo` and the frontend's `Card` type.
*   A `useApi` hook exists for fetching data from the backend.
*   The `API_ENDPOINTS` configuration object in `src/doughub2/ui/frontend/src/config/apiConfig.ts` should be used to provide the URL.

**Tasks:**

1.  **Define API Types:** First, update `src/doughub2/ui/frontend/src/types/index.ts` to include the types for the API response.

    ```typescript
    // Add these new interfaces to the bottom of the file

    export interface QuestionInfo {
        question_id: number;
        source_name: string;
        source_question_key: string;
    }

    export interface QuestionListResponse {
        questions: QuestionInfo[];
    }
    ```

2.  **Fetch Data in `BrowserScreen.tsx`:**
    *   Open `src/doughub2/ui/frontend/src/components/BrowserScreen.tsx`.
    *   Import `useApi`, `QuestionListResponse`, and `API_ENDPOINTS`.
    *   Remove the line that imports `generateMockCards`.
    *   Find the line `const allCards = useMemo(() => generateMockCards(1000), []);` and replace it with a call to the `useApi` hook to fetch the question list.

    ```typescript
    // Replace the mock data generation with this
    const { data: apiResponse, isLoading, error } = useApi<QuestionListResponse>(API_ENDPOINTS.questionsList);
    ```

3.  **Transform API Data:**
    *   Still in `BrowserScreen.tsx`, create a `useMemo` hook to transform the `apiResponse` into the `Card[]` format expected by the UI. This memoized variable will be your new `allCards`.
    *   Use placeholder values for fields that the backend doesn't provide yet.

    ```typescript
    // Add this hook after the useApi call
    const allCards = useMemo((): Card[] => {
        if (!apiResponse?.questions) {
            return [];
        }

        return apiResponse.questions.map((question): Card => ({
            id: question.question_id,
            deck: question.source_name,
            front: question.source_question_key,
            back: "", // Placeholder
            tags: [], // Placeholder
            created: new Date().toISOString(), // Placeholder
            modified: new Date().toISOString(), // Placeholder
            reviews: 0, // Placeholder
            ease: 2.5, // Placeholder
            lapses: 0, // Placeholder
            interval: 0, // Placeholder
            suspended: false, // Placeholder
        }));
    }, [apiResponse]);
    ```
4.  **Handle Loading and Error States:**
    *   Add basic loading and error handling to provide user feedback.

    ```tsx
    // Add this inside the main return div of BrowserScreen component, before the header
    if (isLoading) {
        return <div className="text-center p-8 text-text-secondary">Loading questions...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-status-error">Error fetching questions: {error.message}</div>;
    }
    ```
5.  **Remove Mock Data for Decks and Tags:** The `mockDecks` and `mockTags` are also hardcoded. For now, replace them with empty arrays to avoid breaking the `FilterPanel`. We will populate these from the API in a later step.
    *   Find `const mockDecks = [...]` and replace it with `const mockDecks: { id: number; name: string; cardCount: number }[] = [];`.
    *   Find `const mockTags = [...]` and replace it with `const mockTags: string[] = [];`.

**Files to Inspect or Edit:**

*   `src/doughub2/ui/frontend/src/components/BrowserScreen.tsx` (Edit)
*   `src/doughub2/ui/frontend/src/types/index.ts` (Edit)
*   `src/doughub2/ui/frontend/src/config/apiConfig.ts` (Inspect)
*   `src/doughub2/ui/frontend/src/utils/mockData.ts` (Should no longer be used by `BrowserScreen.tsx`)

**Commands:**

1.  `npm run dev --prefix src/doughub2/ui/frontend` (to run the dev server and test the changes)

**Tests and Validation:**

1.  Run the frontend application.
2.  The "Loading questions..." message should appear briefly.
3.  The `CardTable` should populate with data fetched from the `/api/questions/` endpoint.
4.  The "front" and "deck" columns should show data from the API (`source_question_key` and `source_name`).
5.  Other columns in the table (`Reviews`, `Ease`, etc.) should show their placeholder values.
6.  The filter panel will show no decks or tags, which is expected for now.

**Exit Criteria:**

- [ ] `BrowserScreen.tsx` no longer imports `generateMockCards` or uses `mockData`.
- [ ] `BrowserScreen.tsx` uses the `useApi` hook to fetch question data.
- [ ] The fetched `QuestionInfo[]` data is correctly transformed into `Card[]` data.
- [ ] The `CardTable` successfully displays the live data from the API.
- [ ] Loading and error states are handled in the UI.
- [ ] The `mockDecks` and `mockTags` variables are cleared.

---
I am now creating the prompt file as `28_connect_question_list_to_api.prompt.md`.
Following this, I will continue creating more prompts to complete the UI migration.
I will create the next prompt `29_connect_question_view_to_api.prompt.md` to connect the new UI to the backend API for viewing a single question.
Are you happy for me to proceed?