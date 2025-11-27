---

**Title:** STEP-003: Add Floating Extraction Button

**Goal:** Re-implement the floating action button from the legacy Tampermonkey script into the main React application layout, using Tailwind CSS and shadcn/ui components for styling and behavior, consistent with the project's dark theme.

**Context:**

- The original implementation and styling can be found in `src/doughub2/userscripts/question_extractor.user.js`.
- The UI must adhere to the dark theme colors specified in `.github/instructions/gemini.instructions.md`.
- The frontend is a React with TypeScript application, styled with Tailwind CSS and using shadcn/ui components.
- This button will be the primary user interaction point for the "Question Extraction" feature.
- The button should be placed in the main application layout component. For the purpose of this task, we will assume this component is located at `src/App.tsx`. If a different main layout file exists, it should be used instead.

**Tasks:**

1.  **Analyze Legacy CSS:** Review the `GM_addStyle` block in the userscript to understand the button's appearance, including gradients, shadows, transitions, and states (normal, hover, processing, success, error).

2.  **Update Tailwind Configuration:**
    - In `tailwind.config.js`, extend the theme to include the custom gradients and colors needed for the button's different states.
    - The goal is to match the aesthetic of the original script while adhering to the project's overall dark theme.
    - Example for gradients:
      ```javascript
      backgroundImage: {
        'button-idle': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'button-hover': 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
        'button-success': 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
        'button-error': 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
        'button-processing': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      }
      ```

3.  **Create Button Component:**
    - Create a new component file at `src/components/ui/FloatingActionButton.tsx`.
    - This component should be based on the `shadcn/ui` Button, but styled to be a floating action button.

4.  **Style the Component:**
    - Use Tailwind CSS classes to apply the styles.
    - Position the button as `fixed` in the bottom-right corner of the viewport.
    - Apply the custom background gradients defined in the Tailwind config for different states.
    - Replicate the hover effects (`translateY`, `box-shadow`) using Tailwind's utility classes.

5.  **Implement State Logic:**
    - The component should accept a `status` prop of type `'idle' | 'processing' | 'success' | 'error'`.
    - Use `lucide-react` for icons. The button should display a different icon and text based on the `status` prop:
        - **idle**: Icon `🎴` (or a suitable Lucide icon like `Sparkles`), Text: "Extract"
        - **processing**: Icon `Loader` (spinning), Text: "Extracting..."
        - **success**: Icon `Check`, Text: "Extracted"
        - **error**: Icon `X`, Text: "Error"
    - Use a helper like `clsx` or `tailwind-merge` (included with shadcn/ui) to conditionally apply classes for each state.

6.  **Integrate into Layout:**
    - Import and render the `FloatingActionButton` in the main application layout file (`src/App.tsx` or equivalent).
    - To test the component's states, implement a temporary state machine in `App.tsx`. On button click, it should cycle through the states (e.g., `idle` -> `processing` -> `success` -> `idle` after a delay).

**Files to Inspect or Edit:**

- `src/doughub2/userscripts/question_extractor.user.js` (Inspect)
- `tailwind.config.js` (Edit)
- `src/components/ui/FloatingActionButton.tsx` (Create)
- `src/App.tsx` (Edit, or the correct main layout file)
- `package.json` (Inspect for `lucide-react`, `shadcn/ui`)

**Commands:**

- If the shadcn/ui button is not yet in the project, run: `npx shadcn-ui@latest add button`
- To run the development server: `npm run dev`

**Tests and Validation:**

1.  Launch the React application.
2.  Verify the floating button is visible in the bottom-right corner.
3.  Confirm the button displays the "idle" state style (gradient, icon, text).
4.  Hover over the button to check for the correct hover animations.
5.  Click the button and observe it cycling through the "processing", "success", and "idle" states, with correct visual changes at each step.
6.  Ensure no raw CSS or inline `style` attributes were used; all styling must be from Tailwind CSS classes.

**Exit Criteria:**

- [ ] `tailwind.config.js` contains the new gradient definitions.
- [ ] The reusable `FloatingActionButton.tsx` component has been created.
- [ ] The button is present and fixed within the main application layout.
- [ ] All five visual states (idle, hover, processing, success, error) are correctly implemented.
- [ ] State-appropriate icons from `lucide-react` and text are displayed.
- [ ] The implementation is free of inline styles and uses only Tailwind CSS utilities.

---
