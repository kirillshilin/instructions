---
name: shai-add-nextjs-page
description: >
  Add a new page (route) to an existing Next.js App Router project. Use this skill when the user says "add a page", "create a route", "new page", "add route", "create page for /about", "scaffold a dashboard page", or wants to add any new route segment to a Next.js application. Handles layouts, loading states, error boundaries, dynamic routes, route groups, and metadata.
---

# add-nextjs-page

Add a new page to an existing Next.js App Router project. This skill generates the route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`) following the App Router file conventions, wires up metadata, and applies best practices for Server Components vs Client Components.

**Online docs to reference when adding pages:**

- [App Router Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Pages and Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## When to Use

- User asks to add a new page or route to a Next.js project
- User says "create /about page", "add dashboard route", "new settings page"
- User wants to set up a dynamic route like `/blog/[slug]`
- User needs a route group layout (e.g., `(auth)` for login/register pages)
- User asks to add loading or error states to an existing route

**Do NOT use when:**

- No Next.js project exists yet — use `scaffold-nextjs-app` first
- User wants to create an API route — that's a separate concern (Route Handlers)

## MCP Tools

- **`#tool:snippets`** — provides Tailwind CSS utility snippets for page layouts and common UI patterns. Use when generating page content with Tailwind classes.

## Workflow

### Step 1: Understand the Route

Ask (or infer from context):

1. **Route path** — e.g., `/about`, `/blog`, `/dashboard/settings`, `/blog/[slug]`
2. **Page type** — static page, dynamic route (`[param]`), or catch-all (`[...slug]`)
3. **Needs own layout?** — should this route have a nested layout that wraps its child pages? (e.g., dashboard sidebar, marketing header)
4. **Route group?** — should this be in a route group like `(marketing)` or `(dashboard)` that provides a layout without adding a URL segment?
5. **Loading state?** — does the page fetch data and need a loading skeleton?
6. **Error boundary?** — does the page need its own error boundary?
7. **Data source** — where does the page data come from? (database, API, CMS, static content)

### Step 2: Determine the File Structure

Map the route to App Router file conventions:

| URL Pattern              | Folder Path                                         | Key Files                                 |
| ------------------------ | --------------------------------------------------- | ----------------------------------------- |
| `/about`                 | `src/app/about/`                                    | `page.tsx`                                |
| `/blog`                  | `src/app/blog/`                                     | `page.tsx`, `layout.tsx`                  |
| `/blog/[slug]`           | `src/app/blog/[slug]/`                              | `page.tsx`                                |
| `/blog/[...slug]`        | `src/app/blog/[...slug]/`                           | `page.tsx`                                |
| `/dashboard/*` (grouped) | `src/app/(dashboard)/overview/`, `.../settings/`    | shared `layout.tsx` + child `page.tsx`    |
| `/login`, `/register`    | `src/app/(auth)/login/`, `src/app/(auth)/register/` | `page.tsx` per route, shared `layout.tsx` |

**File convention reference:**

| File            | Purpose                                     | Required?                     |
| --------------- | ------------------------------------------- | ----------------------------- |
| `page.tsx`      | The page component (makes route accessible) | **Yes**                       |
| `layout.tsx`    | Shared UI that wraps child routes           | Only if needed                |
| `loading.tsx`   | Loading skeleton (auto Suspense)            | Only if data fetching         |
| `error.tsx`     | Error boundary (Client Component)           | Only if error handling needed |
| `not-found.tsx` | Custom 404 for this segment                 | Only if needed                |

### Step 3: Generate the Page

#### Static page (Server Component — default)

A standard page is a Server Component. No `"use client"` directive:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "{Page Title}",
  description: "{Page description for SEO}",
};

export default function PageName() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{Page Title}</h1>
      {/* page content */}
    </main>
  );
}
```

**Rules:**

- Export `metadata` for static SEO fields (title, description, Open Graph)
- Use `<main>` as the outermost element for semantic HTML
- Keep it a Server Component unless it needs interactivity
- Use Tailwind for styling — use `#tool:snippets` for layout patterns

#### Dynamic page with params

For routes like `/blog/[slug]`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Fetch data for metadata (e.g., from CMS)
  return {
    title: `Blog — ${slug}`,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  // Fetch the data
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <div className="prose mt-6">{post.content}</div>
    </article>
  );
}
```

**Rules:**

- `params` is a Promise in Next.js 15+ — always `await` it
- Use `generateMetadata()` for dynamic SEO (fetches per request)
- Call `notFound()` to trigger the nearest `not-found.tsx` for invalid params
- The page itself is an `async` Server Component — data fetching happens inline

#### Page with interactivity

When the page needs client-side state or event handlers, extract the interactive parts into a Client Component and keep the page as a Server Component:

```tsx
// src/app/counter/page.tsx (Server Component — the page)
import type { Metadata } from "next";
import { Counter } from "@/components/counter";

export const metadata: Metadata = {
  title: "Counter",
};

export default function CounterPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Counter</h1>
      <Counter />
    </main>
  );
}
```

```tsx
// src/components/counter.tsx (Client Component — interactive part)
"use client";

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4 mt-4">
      <button onClick={() => setCount(count - 1)} className="rounded-md bg-secondary px-3 py-1">
        -
      </button>
      <span className="text-xl font-mono">{count}</span>
      <button onClick={() => setCount(count + 1)} className="rounded-md bg-secondary px-3 py-1">
        +
      </button>
    </div>
  );
}
```

**Key pattern:** Keep the page a Server Component. Push interactivity down into the smallest possible Client Component. This preserves server-side rendering and minimizes client-side JavaScript.

### Step 4: Add Layout (If Needed)

When the route needs a shared layout (sidebar, sub-navigation, header):

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/40 p-4">{/* sidebar navigation */}</aside>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
```

**Route groups** — use `(groupName)` folders to share a layout without adding a URL segment:

```
src/app/(dashboard)/
├── layout.tsx          ← shared dashboard layout (sidebar, header)
├── overview/
│   └── page.tsx        ← /overview
├── settings/
│   └── page.tsx        ← /settings
└── analytics/
    └── page.tsx        ← /analytics
```

The `(dashboard)` folder does NOT appear in the URL.

### Step 5: Add Loading and Error States

#### Loading state

If the page fetches data, add a `loading.tsx` next to the `page.tsx` that re-exports the shared `Loading` component from `src/components/loading.tsx`:

```tsx
export { Loading as default } from "@/components/loading";
```

The shared `Loading` component should already exist at `src/components/loading.tsx` (created during scaffolding via `scaffold-nextjs-app`). If it doesn't exist, check `src/components/` first, then create it there — not inline in the route folder.

Next.js automatically wraps the page in a `<Suspense>` boundary using this file. No manual Suspense setup needed.

#### Error boundary

If the page can fail (data fetching, external API), add an `error.tsx` next to the `page.tsx` that re-exports the shared `ErrorBoundary` component:

```tsx
"use client";

export { ErrorBoundary as default } from "@/components/error-boundary";
```

Check if the `ErrorBoundary` component exists at `src/components/error-boundary.tsx`. If it's missing, create it there first — the error component must be reusable across routes, not duplicated per page.

`error.tsx` must always be a Client Component (`"use client"`).

### Step 6: Present the Result

```
## Page Added

### Route: {url path}
- **Files created**:
  - `src/app/{route}/page.tsx` — page component
  - `src/app/{route}/layout.tsx` — layout (if added)
  - `src/app/{route}/loading.tsx` — loading state (if added)
  - `src/app/{route}/error.tsx` — error boundary (if added)
- **Component type**: Server Component / Client Component
- **Metadata**: static `metadata` export / dynamic `generateMetadata()`

### Next steps:
1. Visit `http://localhost:3000/{route}` to see the page
2. Customize the content in `page.tsx`
3. Add navigation links from other pages using `next/link`
```

## Gotchas

- **Server Components are the default** — don't add `"use client"` to pages unless the page itself needs hooks or event handlers. If only a section is interactive, extract it into a child Client Component.
- **`params` is a Promise** — in Next.js 15+, `params` and `searchParams` are Promises. Always `await` them: `const { slug } = await params;`
- **Metadata must be in Server Components** — the `metadata` export and `generateMetadata()` only work in Server Components (pages and layouts). Client Components cannot export metadata.
- **`loading.tsx` is automatic Suspense** — placing a `loading.tsx` file is equivalent to wrapping the page in `<Suspense fallback={<Loading />}>`. Don't add manual Suspense boundaries around the entire page if you have `loading.tsx`.
- **Layouts don't re-mount** — `layout.tsx` components persist across navigations between child pages. Don't put per-page state in layouts. If you need re-mounting, use `template.tsx` instead (rare).
- **Use `next/link` for navigation** — always use `<Link href="...">` instead of `<a href="...">` for internal links. `next/link` enables client-side navigation with prefetching.
- **Use `next/image` for images** — the `<Image>` component from `next/image` handles responsive sizes, lazy loading, and format optimization. Never use raw `<img>` tags for content images.
- **Route groups affect file structure, not URLs** — a `(marketing)` folder does not add `/marketing` to the URL. Use groups to organize code and share layouts without polluting the URL structure.
- **`not-found.tsx` is per-segment** — calling `notFound()` from a page triggers the nearest `not-found.tsx` up the tree. Add segment-specific not-found pages for dynamic routes.
- **Colocation is encouraged** — place components, styles, and utilities used by a single route inside that route's folder. Shared components go in `src/components/`.
