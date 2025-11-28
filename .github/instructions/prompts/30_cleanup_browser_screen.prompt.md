**Title:** STEP-030: Cleanup and Refactor BrowserScreen Component

**Goal:** To refactor the `BrowserScreen.tsx` component by removing all remaining hardcoded mock data and simplifying the code, thereby finalizing the initial phase of the UI migration and preparing for future backend-driven features.

**Context:**

*   Following the integration of live API data for the question list and detail view, the `BrowserScreen.tsx` component still contains a significant amount of mock data (`mockDecks`, `mockTags`, `defaultSavedFilters`) that is no longer needed.
*   The `FilterPanel` and `QuickEditDialog` components are still being passed this mock data.
*   The `gemini.instructions.md` requires that temporary and mock code be removed after a feature is implemented. This prompt completes that requirement for the UI scaffolding task.

**Tasks:**

1.  **Remove Mock Data from `BrowserScreen.tsx`:**
    *   Open `src/doughub2/ui/frontend/src/components/BrowserScreen.tsx`.
    *   Delete the `mockDecks` constant.
    *   Delete the `mockTags` constant.
    *   Delete the `defaultSavedFilters` constant.

2.  **Update `FilterPanel` Props:**
    *   In the JSX of `BrowserScreen.tsx`, find the `<FilterPanel ... />` component.
    *   Update its props to pass empty arrays for the now-removed mock data. This will gracefully disable the filtering UI until it can be wired to a backend API.

    ```tsx
    // Find the <FilterPanel ... /> component and update these props:
    <FilterPanel
      decks={[]} // Was mockDecks
      tags={[]} // Was mockTags
      savedFilters={[]} // Was savedFilters
      // ... other props remain the same
    />
    ```

3.  **Update `QuickEditDialog` Props:**
    *   In the JSX of `BrowserScreen.tsx`, find the `<QuickEditDialog ... />` component.
    *   Update its `availableTags` prop to pass an empty array.

    ```tsx
    // Find the <QuickEditDialog ... /> component and update this prop:
    <QuickEditDialog
      card={editingCard}
      onClose={() => setEditingCard(null)}
      onSave={(updatedCard) => {
        // Here you would update via AnkiConnect
        console.log("Saving card:", updatedCard);
        setEditingCard(null);
      }}
      availableTags={[]} // Was mockTags
    />
    ```

**Files to Inspect or Edit:**

*   `src/doughub2/ui/frontend/src/components/BrowserScreen.tsx` (Edit)

**Commands:**

*   `npm run dev --prefix src/doughub2/ui/frontend`

**Tests and Validation:**

1.  Run the frontend application. The application should load and display the `CardTable` with data from the API as before.
2.  Verify that the `FilterPanel` on the left side of the screen is now empty and does not display any decks, tags, or saved filters.
3.  Double-click a card to open the `QuickEditDialog`. Verify that the dialog opens correctly and does not show any available tags.
4.  Check the browser's developer console to ensure there are no new errors or warnings related to these changes.

**Exit Criteria:**

- [ ] The `mockDecks`, `mockTags`, and `defaultSavedFilters` variables have been completely removed from `BrowserScreen.tsx`.
- [ ] The `FilterPanel` component is now driven by empty arrays, effectively clearing its UI.
- [ ] The `QuickEditDialog` component is now passed an empty array for `availableTags`.
- [ ] The application runs without errors after these changes.
- [ ] All temporary mock data related to the card browser has been successfully removed from the component.

---
This concludes the initial migration of the UI. I have created three prompts to scaffold the new UI, connect it to the backend for listing and viewing questions, and finally to clean up the mock data.
I am now finished with the request.
Are you happy for me to proceed?