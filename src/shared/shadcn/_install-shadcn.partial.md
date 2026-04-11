# Install shadcn/ui — Shared Partial

Reusable shadcn/ui installation steps for any scaffold skill. Include this
partial in the "optional addons" step of your scaffold workflow.

## Prerequisites

The project must already have:

- **TypeScript** configured
- **Tailwind CSS** installed and working
- **Path aliases** (`@/`) configured in both bundler config and `tsconfig`

The `cn()` utility (`clsx` + `tailwind-merge`) is **not** a prerequisite —
`shadcn init` installs these dependencies and creates `src/lib/utils.ts`
automatically.

## Step: Initialize shadcn/ui

Run the shadcn CLI to initialize the project:

```bash
npx shadcn@latest init
```

When prompted, select:

- **Style:** New York
- **Base color:** Neutral
- **CSS variables:** Yes

> If the user specified a preset (e.g., `default`, `new-york`), pass it
> directly to skip interactive prompts:
>
> ```bash
> npx shadcn@latest init --preset {preset}
> ```

The init command:

1. Detects the framework (Vite, Next.js, etc.) and TypeScript configuration.
2. Installs dependencies: `class-variance-authority`, `clsx`, `tailwind-merge`,
   `lucide-react`, and `@radix-ui/*` primitives as needed.
3. Creates `components.json` with path aliases from `tsconfig`.
4. Creates `src/lib/utils.ts` with the `cn()` class-merge helper.

## Step: Add Starter Components

After init, add commonly used base components:

```bash
npx shadcn@latest add button card
```

> Adapt the component list based on the user's app idea. Examples:
>
> - **Dashboard app** → also add `sidebar`, `dropdown-menu`, `avatar`, `table`
> - **Form-heavy app** → also add `input`, `label`, `select`, `dialog`
> - **Content site** → also add `tabs`, `accordion`, `badge`

See [shadcn/ui components](https://ui.shadcn.com/docs/components) for the full
list.

## Framework-Specific Notes

### Vite SPA (React without SSR)

- `shadcn init` sets `rsc: false` in `components.json` automatically when it
  detects Vite. If it doesn't, verify `components.json` has `"rsc": false` —
  this is a Vite SPA, not a server-components app.

### Next.js (App Router)

- `shadcn init` detects Next.js and enables RSC support in `components.json`
  automatically.
- Server Components are the default in App Router — shadcn components that use
  hooks or event handlers already include `"use client"` directives.
