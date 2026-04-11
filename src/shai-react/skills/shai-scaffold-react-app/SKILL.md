---
name: shai-scaffold-react-app
description: >
  Scaffold a React + Vite + TypeScript + Tailwind CSS + React Router SPA with optional shadcn/ui, data fetching, and state management. Use this skill when the user asks to "create a new React app", "scaffold a React project", "set up a React SPA", "initialize a React frontend", "new react vite app", or "start a new React project" — even if they just say "new React app".
---

# Scaffold React App

Scaffold a production-ready React SPA using Vite, TypeScript, Tailwind CSS v4, and React Router. The skill asks minimal questions, applies sensible defaults, and lets the user opt into addons (shadcn/ui, data fetching, state management).

## When to Use

- User wants to create a new React application from scratch
- User wants to set up a React + Vite + TypeScript project
- User mentions scaffolding a React frontend or SPA
- User says "new React app" or "create React project"

Do NOT use this skill when:

- The user wants a Next.js app (use `scaffold-nextjs-app` instead)
- The user wants to add a component to an existing app (use `create-react-component`)
- The user only wants to set up testing (use `setup-react-testing`)

## Workflow

{../../../shared/\_progress.partial.md}

### Assets

{../../../shared/\_assets.instructions.md}

### Step 1: Gather Requirements

Ask the user for the **project name** if not provided. Use it as `{project}` throughout.

Then ask about optional features. Present defaults clearly — the user should be able to hit Enter and get a working app:

**Required questions:**

1. **Project name** — e.g., `my-app`
2. **App idea or features** (optional) — if the user describes the app's purpose or modules, use this to inform the folder structure (e.g., create `pages/Dashboard.tsx`, `pages/Settings.tsx` instead of generic `Home.tsx`)

**Optional addons (default: No for all):** 3. **shadcn/ui** — install and configure shadcn/ui component library? 4. **Data fetching** — TanStack Query, SWR, or none? 5. **State management** — Zustand, Redux Toolkit, or none (React state + Context)? 6. **Any other libraries** — let the user request additional packages

### Step 2: Create Vite Project

Run the Vite scaffolding command. Always use npm and the `react-ts` template:

```bash
npm create vite@latest {project} -- --template react-ts
cd {project}
```

> **Why `react-ts` and not a framework template?** The `react-ts` template gives a clean SPA starting point. Frameworks like React Router (framework mode) or Next.js have their own scaffolding skills.
>
> **No `npm install` yet** — dependencies will be installed once, together with Tailwind in the next step.

### Step 3: Install and Configure Tailwind CSS v4

Install Tailwind CSS as a Vite plugin — the recommended approach for Vite projects. This also installs all scaffolded dependencies from `package.json` in one pass:

```bash
npm install tailwindcss @tailwindcss/vite
```

Update `vite.config.ts` to include both React and Tailwind plugins:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

Replace `src/index.css` content with:

```css
@import "tailwindcss";
```

### Step 4: Configure Path Aliases

The `@` alias is already set in `vite.config.ts` (Step 3). Now add TypeScript path resolution.

Add to `tsconfig.app.json` `compilerOptions` (merge, don't overwrite):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Step 5: Set Up ESLint + Prettier

{../../../shared/\_eslint-prettier.partial.md}

### Step 6: Set Up React Router

Install React Router for client-side routing:

```bash
npm install react-router
```

Create `src/router.tsx`:

```tsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
```

> If the user described specific app features/modules in Step 1, generate appropriate page routes instead of just `HomePage`. For example, if the user said "a task management app", create routes for `/`, `/tasks`, `/settings`.

### Step 7: Create Folder Structure and Placeholder Files

Create the directory structure:

```bash
mkdir -p src/pages src/components src/hooks src/lib
```

> **Adaptive structure:** If the user described app modules (e.g., "auth", "dashboard", "settings"), create matching page files. Otherwise, use the minimal defaults below.

**`src/main.tsx`** — replace the default entry point:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "@/router";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
```

**`src/components/Layout.tsx`**:

```tsx
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">{project}</h1>
      </header>
      <main className="px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

**`src/pages/HomePage.tsx`**:

```tsx
export default function HomePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Welcome</h2>
      <p className="mt-2 text-muted-foreground">Your app is ready. Start building.</p>
    </div>
  );
}
```

**`src/pages/NotFoundPage.tsx`**:

```tsx
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-2 text-muted-foreground">Page not found</p>
      <Link to="/" className="mt-4 text-primary underline">
        Go home
      </Link>
    </div>
  );
}
```

Remove default Vite files that are no longer needed:

```bash
rm src/App.tsx src/App.css
```

### Step 8: Install Optional Addons

Apply the optional features the user selected in Step 1.

#### shadcn/ui (if selected)

Initialize shadcn/ui first — this installs dependencies (`class-variance-authority`, `clsx`, `tailwind-merge`), creates `components.json`, and sets up `src/lib/utils.ts` automatically:

```bash
npx shadcn@latest init
```

When prompted, select:

- **Style:** New York
- **Base color:** Neutral
- **CSS variables:** Yes

> The init command detects the Vite + React + TypeScript setup and configures path aliases from `tsconfig.app.json` automatically.

Then add commonly used base components:

```bash
npx shadcn@latest add button card
```

> Add more shadcn components based on the user's app idea. For example, if the user described a dashboard app, also add `sidebar`, `dropdown-menu`, `avatar`.

#### Data Fetching (if selected)

**TanStack Query:**

```bash
npm install @tanstack/react-query
```

Wrap the app in `QueryClientProvider` in `src/main.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// Wrap <Router /> with:
// <QueryClientProvider client={queryClient}>
//   <Router />
// </QueryClientProvider>
```

**SWR:**

```bash
npm install swr
```

No global provider needed — SWR works per-hook.

#### State Management (if selected)

**Zustand:**

```bash
npm install zustand
```

Create `src/store/` directory with an example store if relevant to the app idea.

**Redux Toolkit:**

```bash
npm install @reduxjs/toolkit react-redux
```

Set up `src/store/index.ts` with `configureStore` and wrap the app in `<Provider>`.

### Step 9: Verify with Playwright

Start the development server in async mode so it keeps running:

```bash
npm run dev
```

Then use the Playwright MCP tools to visually verify the app:

1. **Navigate** to `http://localhost:5173` using `mcp_playwright_browser_navigate`.
2. **Take a snapshot** with `mcp_playwright_browser_snapshot` and confirm:
   - The page rendered without errors (no blank screen or error overlay).
   - The header shows the project name.
   - The "Welcome" heading and body text are visible.
   - Tailwind styles are applied (layout, spacing, fonts look correct).
3. **Verify 404 routing** — navigate to `http://localhost:5173/nonexistent` using `mcp_playwright_browser_navigate`, then take another snapshot and confirm the "404" heading and "Go home" link are visible.
4. **Click the "Go home" link** using `mcp_playwright_browser_click` and take a final snapshot to confirm it redirects back to the home page.

If any check fails, diagnose and fix before proceeding.

### Step 10: Summary

After scaffolding, show the user what was created:

```
✅ {project} scaffolded successfully

Stack:
  - React 19 + TypeScript
  - Vite (dev server + build)
  - Tailwind CSS v4 (Vite plugin)
  - React Router (client-side routing)
  - ESLint + Prettier
  {- shadcn/ui (if selected)}
  {- TanStack Query / SWR (if selected)}
  {- Zustand / Redux Toolkit (if selected)}

Structure:
  src/
  ├── components/   ← shared components
  │   └── Layout.tsx
  ├── hooks/        ← custom hooks
  ├── lib/          ← utilities
  ├── pages/        ← route pages
  │   ├── HomePage.tsx
  │   └── NotFoundPage.tsx
  ├── router.tsx    ← route definitions
  ├── main.tsx      ← entry point
  └── index.css     ← Tailwind import

Commands:
  npm run dev       ← start dev server
  npm run build     ← production build
  npm run preview   ← preview production build
  npm run lint      ← run ESLint
```

Suggest next steps:

- "Use `create-react-component` to add new components"
- "Add pages to `src/router.tsx` as your app grows"

## Gotchas

- **Do NOT use Create React App (CRA)** — it's deprecated. Always use Vite.
- **Tailwind v4 uses `@tailwindcss/vite`** — not PostCSS config. Don't create `tailwind.config.js` or `postcss.config.js` — they're not needed with the Vite plugin approach.
- **`@import "tailwindcss"`** — Tailwind v4 uses a single CSS import, not the old `@tailwind base/components/utilities` directives.
- **shadcn/ui needs `rsc: false`** in `components.json` — this is a Vite SPA, not a server-components app.
- **Path alias `/src` not `./src`** — in `vite.config.ts`, the alias replacement should be `/src` (absolute from project root), while `tsconfig.app.json` uses `./src/*` (relative).
- **Don't delete `public/`** — Vite serves static assets from `public/`. Keep it even if empty.
- **ESLint flat config** — Vite's template uses the new ESLint flat config format (`eslint.config.js`), not `.eslintrc`. Make sure Prettier integration uses the flat config approach.
- **React Router v7** uses `react-router` package (not `react-router-dom`). The `createBrowserRouter` API is imported from `react-router` directly.
