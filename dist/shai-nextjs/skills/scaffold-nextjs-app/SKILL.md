---
name: scaffold-nextjs-app
description: >
  Scaffold a new Next.js project with App Router, TypeScript, Tailwind CSS, and sensible defaults. Use this skill when the user says "create a Next.js app", "scaffold Next.js project", "new next app", "set up Next.js", "init nextjs", "bootstrap nextjs", or wants to start a new Next.js project from scratch. Produces a production-ready folder structure with layouts, error boundaries, middleware stub, environment config, and recommended configuration.
---

# scaffold-nextjs-app

Scaffold a new Next.js application using the App Router with TypeScript and Tailwind CSS. Produces a clean, production-ready project structure following the conventions from the official Next.js documentation.

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

- The project already has a Next.js setup — use `add-nextjs-page` to add pages
- User wants a plain React app without Next.js — use `scaffold-react-app`

## MCP Tools

This skill uses the following MCP tools:

- **`#tool:snippets`** — provides Tailwind CSS utility snippets. Must be installed globally. When generating Tailwind-based components or layouts, use this MCP to pull in community-vetted class combinations for common patterns (hero sections, cards, navbars, etc.). Especially useful when creating pages and components during or after scaffolding.

## Workflow

{../../../shared/\_assets.instructions.md}

### Step 1: Gather Project Requirements

Ask the user (or infer from context):

1. **Project name** — slug for the directory (e.g., `my-app`)
2. **Package manager** — `npm`, `pnpm`, or `yarn` (default: `npm`)
3. **Source directory** — use `src/` directory? (default: yes)
4. **Import alias** — path alias prefix (default: `@/`)
5. **shadcn/ui** — install the shadcn/ui component library? (default: no) — built on Radix + Tailwind, provides accessible UI primitives. If yes, ask which **preset** to use (`default`, `new-york`, etc.) for the `--preset` flag during `shadcn init`.
6. **Turbopack** — use Turbopack for dev server? (default: yes)

Keep it light — don't force answers. Sensible defaults for everything. ESLint is included by default via `create-next-app` — no need to ask.

### Step 2: Run create-next-app

Use the official CLI with recommended flags:

```bash
npx create-next-app@latest {project-name} \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack \
  --use-{package-manager}
```

All flags explained:

| Flag             | Why                                              |
| ---------------- | ------------------------------------------------ |
| `--typescript`   | Type safety — always on                          |
| `--tailwind`     | Utility-first CSS — always on for this plugin    |
| `--eslint`       | Linting — always on                              |
| `--app`          | App Router — the modern Next.js routing model    |
| `--src-dir`      | Keeps root clean; app code lives under `src/`    |
| `--import-alias` | Clean imports with `@/` prefix                   |
| `--turbopack`    | Faster dev server — recommended for new projects |
| `--use-<pm>`     | Respects user's package manager choice           |

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
│   │   ├── error.tsx             ← root error boundary (re-exports shared)
│   │   ├── loading.tsx           ← root loading state (re-exports shared)
│   │   └── globals.css           ← Tailwind directives + global styles
│   ├── components/
│   │   ├── error-boundary.tsx    ← reusable error boundary (client component)
│   │   ├── loading.tsx           ← reusable loading spinner
│   │   └── ui/                   ← reusable UI primitives (buttons, inputs)
│   └── lib/
│       └── utils.ts              ← shared utilities (cn() helper)
├── public/                       ← static assets (favicon, images, fonts)
├── .env.local                    ← environment variables (gitignored)
├── middleware.ts                  ← request middleware (matcher stub)
├── next.config.ts                ← Next.js configuration
├── tsconfig.json                 ← TypeScript configuration
├── postcss.config.mjs            ← PostCSS configuration (Tailwind plugin)
└── package.json
```

**Always install `cn()` dependencies** — the `clsx` + `tailwind-merge` combo is the standard for merging Tailwind classes:

```bash
npm install clsx tailwind-merge
```

**Files to create or enhance:**

#### `src/lib/utils.ts`

Class name merge utility (standard pattern with Tailwind):

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create the following components using their reference files:

- **`src/app/not-found.tsx`** — read [references/not-found.md](references/not-found.md)
- **`src/components/error-boundary.tsx`** + **`src/app/error.tsx`** — read [references/error-boundary.md](references/error-boundary.md)
- **`src/components/loading.tsx`** + **`src/app/loading.tsx`** — read [references/loading.md](references/loading.md)

#### `.env.local`

Environment variables (gitignored by Next.js automatically):

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME={project-name}

# API (add your keys here)
# API_SECRET_KEY=
```

#### `middleware.ts`

Request middleware stub at the project root (next to `next.config.ts`):

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Add middleware logic here (auth, redirects, headers, etc.)
  return NextResponse.next();
}

export const config = {
  // Match all routes except static files and Next.js internals
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

Create the `src/components/ui/` directory as an empty placeholder for UI primitives.

### Step 4: Set Up shadcn/ui

Only if the user said **yes** to shadcn/ui in Step 1.

Initialize with the user's chosen preset:

```bash
npx shadcn@latest init --preset {preset}
```

Common presets: `default`, `new-york`. The `cn()` utility from Step 3 is required — shadcn/ui depends on it.

After init, suggest installing a few starter components:

```bash
npx shadcn@latest add button card input
```

See [shadcn/ui docs](https://ui.shadcn.com/docs/installation/next) for the full component list.

### Step 5: Set Up Prettier

The project already includes ESLint. Add Prettier integration:

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

Add `prettierRecommended` to `eslint.config.js`:

```js
import prettierRecommended from "eslint-plugin-prettier/recommended";

// Add to the extends array of the existing config:
// extends: [...existingExtends, prettierRecommended]
```

The `.prettierrc` file is provided in the skill's `assets/` folder and will be
copied to the project root automatically (All generated files MUST use LF (`\n`) line endings — never CRLF (`\r\n`). When Prettier is configured, set `"endOfLine": "lf"` in `.prettierrc`.
).


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
- **shadcn/ui**: {yes (preset) / no}
- **Package manager**: {npm/pnpm/yarn}

### Structure:
{show the folder tree}

### Next steps:
1. `cd {project-name} && npm run dev` to start the dev server
2. Open `http://localhost:3000` to see your app
3. Use `/add-nextjs-page` to add new pages
4. Edit `src/app/page.tsx` to customize the home page
```

## Gotchas

- **Always use App Router** — the Pages Router (`pages/`) is legacy. Do not scaffold with it unless the user explicitly insists. App Router is the default and recommended approach since Next.js 13.4+.
- **`"use client"` is not the default** — components in the App Router are Server Components by default. Only add `"use client"` when the component uses browser APIs, hooks (`useState`, `useEffect`, etc.), or event handlers. The `error.tsx` file must be a Client Component.
- **`layout.tsx` vs `template.tsx`** — layouts persist across navigations and don't re-mount. Use `template.tsx` only when you need the component to re-mount on every navigation (rare — analytics, enter animations).
- **Metadata API over `<Head>`** — use the `metadata` export or `generateMetadata()` in layouts/pages. Do not use `next/head`.
- **Image optimization** — use `next/image` instead of `<img>`. It handles lazy loading, responsive sizes, and format optimization automatically.
- **Font optimization** — use `next/font` to self-host Google Fonts with zero layout shift. The CLI sets this up in the root layout by default.
- **`cn()` utility** — the `clsx` + `tailwind-merge` combo is the community standard for merging Tailwind classes. Always include it for Tailwind projects.
- **Don't eject or customize Webpack** — Next.js manages its own bundling. Use `next.config.ts` for configuration. Avoid custom Webpack configs unless absolutely necessary.
- **`middleware.ts` location** — must be at the project root (next to `next.config.ts`), NOT inside `src/`. Next.js only detects it at the root.
