**Title:** STEP-027: Replace Frontend with New Figma-based UI Scaffold

**Goal:** To perform a complete replacement of the current React frontend with the new, feature-rich UI design exported from Figma. This involves swapping out the source files, merging dependencies, and updating the entire frontend configuration to support the new `shadcn/ui` component library and design system.

**Context:**

*   The current frontend is located in `src/doughub2/ui/frontend`.
*   The new UI, exported from Figma and based on `shadcn/ui`, is located in `Temporary_1.1 - DougHub`.
*   The project requires consolidating dependencies from both `package.json` files and updating build configurations (`vite`, `tailwind`, `tsconfig`) to align with the new UI's requirements.
*   The `react-router-dom` dependency from the old frontend must be preserved.
*   The project's dark theme color palette, as defined in `gemini.instructions.md`, must be maintained.

**Tasks:**

1.  **Clean Slate:** Delete all existing files and directories within `src/doughub2/ui/frontend/src`.
2.  **Copy New UI Source:** Copy the entire contents of `Temporary_1.1 - DougHub/src` into `src/doughub2/ui/frontend/src`.
3.  **Update Dependencies:** Replace the content of `src/doughub2/ui/frontend/package.json` with the following merged dependencies to incorporate `shadcn/ui` and other new libraries while retaining `react-router-dom`.

    ```json
    {
        "name": "doughub2-frontend",
        "private": true,
        "version": "0.1.0",
        "type": "module",
        "scripts": {
            "dev": "vite",
            "build": "tsc -b && vite build",
            "lint": "eslint .",
            "preview": "vite preview"
        },
        "dependencies": {
            "@radix-ui/react-accordion": "^1.2.3",
            "@radix-ui/react-alert-dialog": "^1.1.6",
            "@radix-ui/react-aspect-ratio": "^1.1.2",
            "@radix-ui/react-avatar": "^1.1.3",
            "@radix-ui/react-checkbox": "^1.1.4",
            "@radix-ui/react-collapsible": "^1.1.3",
            "@radix-ui/react-context-menu": "^2.2.6",
            "@radix-ui/react-dialog": "^1.1.6",
            "@radix-ui/react-dropdown-menu": "^2.1.6",
            "@radix-ui/react-hover-card": "^1.1.6",
            "@radix-ui/react-label": "^2.1.2",
            "@radix-ui/react-menubar": "^1.1.6",
            "@radix-ui/react-navigation-menu": "^1.2.5",
            "@radix-ui/react-popover": "^1.1.6",
            "@radix-ui/react-progress": "^1.1.2",
            "@radix-ui/react-radio-group": "^1.2.3",
            "@radix-ui/react-scroll-area": "^1.2.3",
            "@radix-ui/react-select": "^2.1.6",
            "@radix-ui/react-separator": "^1.1.2",
            "@radix-ui/react-slider": "^1.2.3",
            "@radix-ui/react-slot": "^1.1.2",
            "@radix-ui/react-switch": "^1.1.3",
            "@radix-ui/react-tabs": "^1.1.3",
            "@radix-ui/react-toggle": "^1.1.2",
            "@radix-ui/react-toggle-group": "^1.1.2",
            "@radix-ui/react-tooltip": "^1.1.8",
            "@types/dompurify": "^3.0.5",
            "class-variance-authority": "^0.7.1",
            "clsx": "^2.1.1",
            "cmdk": "^1.1.1",
            "dompurify": "^3.3.0",
            "embla-carousel-react": "^8.6.0",
            "input-otp": "^1.4.2",
            "lucide-react": "^0.487.0",
            "next-themes": "^0.4.6",
            "react": "^18.3.1",
            "react-day-picker": "^8.10.1",
            "react-dom": "^18.3.1",
            "react-hook-form": "^7.55.0",
            "react-resizable-panels": "^2.1.7",
            "react-router-dom": "^7.9.6",
            "recharts": "^2.15.2",
            "sonner": "^2.0.3",
            "tailwind-merge": "^2.6.0",
            "vaul": "^1.1.2"
        },
        "devDependencies": {
            "@eslint/js": "^9.17.0",
            "@types/node": "^20.10.0",
            "@types/react": "^18.3.18",
            "@types/react-dom": "^18.3.5",
            "@vitejs/plugin-react-swc": "^3.10.2",
            "autoprefixer": "^10.4.20",
            "eslint": "^9.17.0",
            "eslint-plugin-react-hooks": "^5.0.0",
            "eslint-plugin-react-refresh": "^0.4.16",
            "globals": "^15.14.0",
            "postcss": "^8.4.49",
            "tailwindcss": "^3.4.17",
            "typescript": "~5.6.2",
            "typescript-eslint": "^8.18.2",
            "vite": "^6.0.5"
        }
    }
    ```
4.  **Update Vite Configuration:** Replace the content of `src/doughub2/ui/frontend/vite.config.ts` with the new configuration that includes path aliasing.

    ```typescript
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react-swc';
    import path from 'path';

    export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    });
    ```
5.  **Update tsconfig.json:** Replace the content of `src/doughub2/ui/frontend/tsconfig.json` to add the `@/*` path alias.

    ```json
    {
        "compilerOptions": {
            "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
            "target": "ES2020",
            "useDefineForClassFields": true,
            "lib": [
                "ES2020",
                "DOM",
                "DOM.Iterable"
            ],
            "module": "ESNext",
            "skipLibCheck": true,
            "forceConsistentCasingInFileNames": true,
            /* Bundler mode */
            "moduleResolution": "bundler",
            "allowImportingTsExtensions": true,
            "isolatedModules": true,
            "moduleDetection": "force",
            "noEmit": true,
            "jsx": "react-jsx",
            /* Linting */
            "strict": true,
            "noUnusedLocals": true,
            "noUnusedParameters": true,
            "noFallthroughCasesInSwitch": true,
            /* Path aliases */
            "baseUrl": ".",
            "paths": {
                "@/*": [
                    "./src/*"
                ]
            }
        },
        "include": [
            "src"
        ]
    }
    ```
6.  **Copy Tailwind and PostCSS Configs**:
    *   Copy `Temporary_1.1 - DougHub/tailwind.config.js` to `src/doughub2/ui/frontend/tailwind.config.js`, overwriting the existing file.
    *   Copy `Temporary_1.1 - DougHub/postcss.config.js` to `src/doughub2/ui/frontend/postcss.config.js`, overwriting the existing file.


**Files to Inspect or Edit:**

*   `src/doughub2/ui/frontend/src/` (Delete and Replace contents)
*   `src/doughub2/ui/frontend/package.json` (Overwrite)
*   `src/doughub2/ui/frontend/vite.config.ts` (Overwrite)
*   `src/doughub2/ui/frontend/tsconfig.json` (Overwrite)
*   `src/doughub2/ui/frontend/tailwind.config.js` (Overwrite)
*   `src/doughub2/ui/frontend/postcss.config.js` (Overwrite)
*   `Temporary_1.1 - DougHub/` (Source for new files)

**Commands:**

1.  `npm install --prefix src/doughub2/ui/frontend`

**Tests and Validation:**

1.  After `npm install` completes, run `npm run dev --prefix src/doughub2/ui/frontend`.
2.  The Vite development server should start without any build errors.
3.  Open the browser to the specified local address. The new application shell from `App.tsx` should render, likely showing the main dashboard or navigation component from the new UI.

**Exit Criteria:**

- [ ] `src/doughub2/ui/frontend/src` contains the files from `Temporary_1.1 - DougHub/src`.
- [ ] `package.json` is updated with the new merged dependencies.
- [ ] `vite.config.ts` and `tsconfig.json` are updated with the new path alias configuration.
- [ ] All new npm dependencies are installed successfully.
- [ ] The application compiles and runs successfully with `npm run dev`.
- [ ] The rendered UI in the browser matches the general layout of the new Figma design.
- [ ] No temporary files or debugging statements have been committed.

---
I have noticed that the file `Temporary_1.1 - DougHub/tailwind.config.js` doesn't exist. Can you create a new one with a default configuration? I also noticed that there is no `Temporary_1.1 - DougHub/postcss.config.js`, so a default file should also be created. 
I am now creating the prompt file as `27_replace_frontend_scaffold.prompt.md`.
Following this, I will continue creating more prompts to complete the UI migration.
I will create the next prompt `28_connect_question_list_to_api.prompt.md` to connect the new UI to the backend API.
Are you happy for me to proceed?