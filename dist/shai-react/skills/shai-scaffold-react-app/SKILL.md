---
name: shai-scaffold-react-app
description: >
  Scaffold a React + Vite + TypeScript + Tailwind CSS + React Router SPA with
  optional shadcn/ui, data fetching, and state management. Use this skill when
  the user asks to "create a new React app", "scaffold a React project",
  "set up a React SPA", "initialize a React frontend", "new react vite app",
  or "start a new React project" — even if they just say "new React app".
---

# Scaffold React App

Scaffold a production-ready React SPA using Vite, TypeScript, Tailwind CSS v4,
and React Router. The skill asks minimal questions, applies sensible defaults,
and lets the user opt into addons (shadcn/ui, data fetching, state management).

## When to Use

- User wants to create a new React application from scratch
- User wants to set up a React + Vite + TypeScript project
- User mentions scaffolding a React frontend or SPA
- User says "new React app" or "create React project"

Do NOT use this skill when:
- The user wants a Next.js app (use `shai-scaffold-nextjs-app` instead)
- The user wants to add a component to an existing app (use `shai-create-react-component`)
- The user only wants to set up testing (use `shai-setup-react-testing`)

## Workflow

### Progress Reporting (mandatory)

At the start of each workflow step, output a progress indicator in bold blue:

**🔵 Step M/N — {Step title}**

where M is the current step number and N is the total number of steps in the
workflow. This is mandatory for every step — never skip it.

### Step 1: Gather Requirements

Ask the user for the **project name** if not provided. Use it as `{project}`
throughout.

Then ask about optional features. Present defaults clearly — the user should be
able to hit Enter and get a working app:

**Required questions:**
1. **Project name** — e.g., `my-app`
2. **App idea or features** (optional) — if the user describes the app's purpose
   or modules, use this to inform the folder structure (e.g., create
   `pages/Dashboard.tsx`, `pages/Settings.tsx` instead of generic `Home.tsx`)

**Optional addons (default: No for all):**
3. **shadcn/ui** — install and configure shadcn/ui component library?
4. **Data fetching** — TanStack Query, SWR, or none?
5. **State management** — Zustand, Redux Toolkit, or none (React state + Context)?
6. **Any other libraries** — let the user request additional packages

### Step 2: Create Vite Project

Run the Vite scaffolding command. Always use npm and the `react-ts` template:

```bash
npm create vite@latest {project} -- --template react-ts
cd {project}
npm install
```

> **Why `react-ts` and not a framework template?** The `react-ts` template gives
> a clean SPA starting point. Frameworks like React Router (framework mode) or
> Next.js have their own scaffolding skills.

### Step 3: Install and Configure Tailwind CSS v4

Install Tailwind CSS as a Vite plugin — the recommended approach for Vite projects:

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

The `@` alias is already set in `vite.config.ts` (Step 3). Now add TypeScript
path resolution.

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

The Vite template already includes ESLint with React plugins. Add Prettier
integration:

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

Add `prettierRecommended` to `eslint.config.js`:

```js
import prettierRecommended from "eslint-plugin-prettier/recommended";

// Add to the extends array of the existing config:
// extends: [...existingExtends, prettierRecommended]
```

Create `.prettierrc` in the project root:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80
}
```

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

> If the user described specific app features/modules in Step 1, generate
> appropriate page routes instead of just `HomePage`. For example, if the user
> said "a task management app", create routes for `/`, `/tasks`, `/settings`.

### Step 7: Create Folder Structure and Placeholder Files

Create the directory structure:

```bash
mkdir -p src/pages src/components src/hooks src/lib
```

> **Adaptive structure:** If the user described app modules (e.g., "auth",
> "dashboard", "settings"), create matching page files. Otherwise, use the
> minimal defaults below.

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
      <p className="mt-2 text-muted-foreground">
        Your app is ready. Start building.
      </p>
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

Install shadcn/ui dependencies and initialize:

```bash
npm install class-variance-authority clsx tailwind-merge
npm install -D @types/node
```

Create `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create `components.json` in the project root:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

Then add commonly used base components:

```bash
npx shadcn@latest add button card
```

> Add more shadcn components based on the user's app idea. For example, if the
> user described a dashboard app, also add `sidebar`, `dropdown-menu`, `avatar`.

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

### Step 9: Verify

Run the development server to confirm everything works:

```bash
npm run dev
```

Check for:
- No compilation errors
- Home page renders at `http://localhost:5173`
- Tailwind classes are applied
- Routing works (navigate to a non-existent path → 404 page)

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
- "Use `shai-create-react-component` to add new components"
- "Add pages to `src/router.tsx` as your app grows"

## Gotchas

- **Do NOT use Create React App (CRA)** — it's deprecated. Always use Vite.
- **Tailwind v4 uses `@tailwindcss/vite`** — not PostCSS config. Don't create
  `tailwind.config.js` or `postcss.config.js` — they're not needed with the
  Vite plugin approach.
- **`@import "tailwindcss"`** — Tailwind v4 uses a single CSS import, not the
  old `@tailwind base/components/utilities` directives.
- **shadcn/ui needs `rsc: false`** in `components.json` — this is a Vite SPA,
  not a server-components app.
- **Path alias `/src` not `./src`** — in `vite.config.ts`, the alias
  replacement should be `/src` (absolute from project root), while
  `tsconfig.app.json` uses `./src/*` (relative).
- **Don't delete `public/`** — Vite serves static assets from `public/`. Keep
  it even if empty.
- **ESLint flat config** — Vite's template uses the new ESLint flat config
  format (`eslint.config.js`), not `.eslintrc`. Make sure Prettier integration
  uses the flat config approach.
- **React Router v7** uses `react-router` package (not `react-router-dom`).
  The `createBrowserRouter` API is imported from `react-router` directly.
