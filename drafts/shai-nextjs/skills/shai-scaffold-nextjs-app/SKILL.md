---
name: shai-scaffold-nextjs-app
description: >
  Scaffold a new Next.js project with App Router, TypeScript, Tailwind CSS, and
  sensible defaults. Use this skill when the user says "create a Next.js app",
  "scaffold Next.js project", "new next app", "set up Next.js", "init nextjs",
  "bootstrap nextjs", or wants to start a new Next.js project from scratch.
  Produces a production-ready folder structure with layouts, error boundaries,
  and recommended configuration.
---

# shai-scaffold-nextjs-app

Scaffold a new Next.js application using the App Router with TypeScript and
Tailwind CSS. Produces a clean, production-ready project structure following
the conventions from the official Next.js documentation.

**Online docs to reference during scaffolding:**

- [Next.js Getting Started](https://nextjs.org/docs/getting-started/installation)
- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
- [App Router](https://nextjs.org/docs/app)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)

## When to Use

- User wants to create a new Next.js application
- User says "scaffold", "bootstrap", "init", "set up" a Next.js project
- User is starting a greenfield web project and picks Next.js
- User wants to migrate from Pages Router to App Router (scaffold the new structure)

**Do NOT use when:**

- The project already has a Next.js setup — use `shai-add-nextjs-page` to add pages
- User wants a plain React app without Next.js — use `shai-scaffold-react-app`

## MCP Tools

This skill references the following MCP tool:

- **`#tool:snippets`** — provides Tailwind CSS utility snippets. When generating
  Tailwind-based components or layouts, use this MCP to pull in community-vetted
  class combinations for common patterns (hero sections, cards, navbars, etc.).

## Workflow

### Step 1: Gather Project Requirements

Ask the user (or infer from context):

1. **Project name** — slug for the directory (e.g., `my-app`)
2. **Package manager** — `npm`, `pnpm`, or `yarn` (default: `npm`)
3. **Source directory** — use `src/` directory? (default: yes)
4. **Import alias** — path alias prefix (default: `@/`)
5. **Extra integrations** — does the user want any of these?
   - **shadcn/ui** — component library built on Radix + Tailwind
   - **ESLint** — included by default via `create-next-app`
   - **Turbopack** — use Turbopack for dev server (default: yes)

Keep it light — don't force answers. Sensible defaults for everything.

### Step 2: Run create-next-app

Use the official CLI with recommended flags:

```bash
npx create-next-app@latest <project-name> \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack \
  --use-<package-manager>
```

All flags explained:

| Flag              | Why                                                       |
| ----------------- | --------------------------------------------------------- |
| `--typescript`    | Type safety — always on                                   |
| `--tailwind`      | Utility-first CSS — always on for this plugin             |
| `--eslint`        | Linting — always on                                       |
| `--app`           | App Router — the modern Next.js routing model             |
| `--src-dir`       | Keeps root clean; app code lives under `src/`             |
| `--import-alias`  | Clean imports with `@/` prefix                            |
| `--turbopack`     | Faster dev server — recommended for new projects          |
| `--use-<pm>`      | Respects user's package manager choice                    |

After the CLI finishes, `cd` into the project directory.

### Step 3: Enhance the Project Structure

The CLI gives a minimal structure. Enhance it to be production-ready.

**Target folder structure:**

```
<project-name>/
├── src/
│   ├── app/
│   │   ├── layout.tsx            ← root layout (html, body, fonts, metadata)
│   │   ├── page.tsx              ← home page
│   │   ├── not-found.tsx         ← custom 404 page
│   │   ├── error.tsx             ← root error boundary (client component)
│   │   ├── loading.tsx           ← root loading skeleton
│   │   └── globals.css           ← Tailwind directives + global styles
│   ├── components/
│   │   └── ui/                   ← reusable UI primitives (buttons, inputs, cards)
│   ├── lib/
│   │   └── utils.ts              ← shared utility functions (e.g., cn() helper)
│   └── types/
│       └── index.ts              ← shared TypeScript types
├── public/                       ← static assets (favicon, images, fonts)
├── next.config.ts                ← Next.js configuration
├── tailwind.config.ts            ← Tailwind configuration
├── tsconfig.json                 ← TypeScript configuration
├── postcss.config.mjs            ← PostCSS configuration (Tailwind plugin)
└── package.json
```

**Files to create or enhance:**

#### `src/app/not-found.tsx`

A user-friendly 404 page:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Go Home
      </Link>
    </main>
  );
}
```

#### `src/app/error.tsx`

A root error boundary (must be a Client Component):

```tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </main>
  );
}
```

#### `src/app/loading.tsx`

A root loading skeleton using Tailwind:

```tsx
export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </main>
  );
}
```

#### `src/lib/utils.ts`

Class name merge utility (standard pattern with Tailwind):

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

If the user opted for the `cn()` utility, install the dependencies:

```bash
npm install clsx tailwind-merge
```

#### `src/types/index.ts`

Shared type barrel:

```typescript
export type {};
```

Create the `src/components/ui/` directory as an empty placeholder for UI primitives.

### Step 4: Set Up shadcn/ui (Optional)

Only if the user requested shadcn/ui:

```bash
npx shadcn@latest init
```

This will configure `components.json` and set up the theme. The `cn()` utility
from Step 3 is required — shadcn/ui depends on it.

After init, suggest installing a few starter components:

```bash
npx shadcn@latest add button card input
```

See [shadcn/ui docs](https://ui.shadcn.com/docs/installation/next) for the
full component list.

### Step 5: Tailwind Snippets

Use `#tool:snippets` to fetch Tailwind utility snippets for common UI patterns.
This is useful when the user asks for specific layout patterns during
scaffolding (e.g., "add a hero section", "add a navbar").

The snippets MCP provides community-maintained Tailwind class combinations.
Usage will be expanded as the MCP matures — for now, reference it when
generating Tailwind-heavy components.

### Step 6: Verify the Setup

Run these checks to ensure everything works:

```bash
# Install dependencies (if not already done)
npm install

# Start the dev server — should compile without errors
npm run dev

# Type check — should pass with no errors
npx tsc --noEmit

# Lint check — should pass
npm run lint
```

If any check fails, fix the issue before presenting the result.

### Step 7: Present the Result

```
## Scaffolding Complete

### Project: {project-name}
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **shadcn/ui**: {yes/no}
- **Package manager**: {npm/pnpm/yarn}

### Structure:
{show the folder tree}

### Next steps:
1. `cd {project-name} && npm run dev` to start the dev server
2. Open `http://localhost:3000` to see your app
3. Use `/shai-add-nextjs-page` to add new pages
4. Edit `src/app/page.tsx` to customize the home page
```

## Gotchas

- **Always use App Router** — the Pages Router (`pages/`) is legacy. Do not
  scaffold with it unless the user explicitly insists. App Router is the default
  and recommended approach since Next.js 13.4+.
- **`"use client"` is not the default** — components in the App Router are
  Server Components by default. Only add `"use client"` when the component uses
  browser APIs, hooks (`useState`, `useEffect`, etc.), or event handlers.
  The `error.tsx` file must be a Client Component.
- **`layout.tsx` vs `template.tsx`** — layouts persist across navigations and
  don't re-mount. Use `template.tsx` only when you need the component to
  re-mount on every navigation (rare — analytics, enter animations).
- **Metadata API over `<Head>`** — use the `metadata` export or
  `generateMetadata()` in layouts/pages. Do not use `next/head`.
- **Image optimization** — use `next/image` instead of `<img>`. It handles
  lazy loading, responsive sizes, and format optimization automatically.
- **Font optimization** — use `next/font` to self-host Google Fonts with zero
  layout shift. The CLI sets this up in the root layout by default.
- **`cn()` utility** — the `clsx` + `tailwind-merge` combo is the community
  standard for merging Tailwind classes. Always include it for Tailwind projects.
- **Don't eject or customize Webpack** — Next.js manages its own bundling.
  Use `next.config.ts` for configuration. Avoid custom Webpack configs unless
  absolutely necessary.
