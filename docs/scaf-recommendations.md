# `scaf` Template Recommendations

Static files (configs, boilerplate JSON, repeated folder structures) should live in the global [`scaf`](https://www.npmjs.com/) CLI rather than being duplicated inside SHAI scaffolding skills. Skills should describe **decisions and reasoning**; templates should ship the **bytes**.

Currently bundled templates (run `scaf list` to confirm):

| Template   | Purpose                                                          |
| ---------- | ---------------------------------------------------------------- |
| `node-cli` | Node.js CLI (TypeScript, ESM) with yargs, jest, eslint, prettier |
| `firebase` | npm-workspaces monorepo with Cloud Functions + React/Vite UI     |

## Recommended templates to add

Each row corresponds to a SHAI scaffolding skill. Once the template exists, the skill can collapse into "run `scaf <template> {project}` then continue with the addon-specific steps".

## Shared Baseline Policy

### ESLint + Prettier baseline

Do not duplicate this baseline across scaffolding skills or partials as inline static snippets.

- Install in template: `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
- Configure in template: include `eslint-plugin-prettier/recommended` in `eslint.config.js`
- Generate in template: `.prettierrc` with team defaults

Skills should only state that the project uses the ESLint + Prettier baseline and rely on the selected `scaf` template to materialize files and dependencies.

### `ts-workspace`

Replaces Steps 2–7 of [shai-scaffold-ts-workspace](../src/shai-typescript/skills/shai-scaffold-ts-workspace/SKILL.md).

**Files:**

- `package.json` — `private: true`, `type: module`, `workspaces: ["apps/*", "packages/*"]`, scripts: `build`, `build:prod`, `test` (watch), `test:once`, `lint`, `lint:fix`, `typecheck`
- `tsconfig.base.json` — `target: ES2022`, `module: Node16`, `moduleResolution: Node16`, `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `declaration`, `declarationMap`, `sourceMap`, `resolveJsonModule`, `isolatedModules`, `esModuleInterop`, `skipLibCheck`, `forceConsistentCasingInFileNames`
- `tsconfig.json` — `{ "files": [], "references": [] }`
- `eslint.config.js` — flat config with `@eslint/js` recommended + `typescript-eslint` strict-type-checked + `eslint-plugin-prettier/recommended`, `projectService: true`
- `jest.config.ts` — multi-project (`projects: ["<rootDir>/apps/*/jest.config.ts", "<rootDir>/packages/*/jest.config.ts"]`)
- `jest.base.config.ts` — ESM ts-jest preset, `testMatch: ["**/*.test.ts", "**/*.spec.ts"]`, ESM moduleNameMapper
- `.prettierrc`, `.editorconfig`, `.gitattributes`, `.gitignore`
- Empty `apps/` and `packages/` directories

**Variables:** `name`, `scope` (default `@{name}`).

### `react-vite`

Replaces Steps 2–7 of [shai-scaffold-react-app](../src/shai-react/skills/shai-scaffold-react-app/SKILL.md).

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`) + React Router v7 + ESLint + Prettier.

**Files:**

- `package.json` with the dependencies above
- `vite.config.ts` with React + Tailwind plugins and `@/* → /src/*` alias
- `tsconfig.app.json` patched with `baseUrl: "."` + `paths: { "@/*": ["./src/*"] }`
- `src/index.css` containing only `@import "tailwindcss";`
- `src/main.tsx`, `src/router.tsx`, `src/components/Layout.tsx`, `src/pages/HomePage.tsx`, `src/pages/NotFoundPage.tsx` (placeholders)

**Variables:** `name`.

**Optional includes (`--with`):** `shadcn`, `tanstack-query`, `swr`, `zustand`, `redux-toolkit`.

### `nextjs-app`

Replaces Steps 2–5 of [shai-scaffold-nextjs-app](../src/shai-nextjs/skills/shai-scaffold-nextjs-app/SKILL.md).

**Stack:** Next.js App Router + TypeScript + Tailwind + Turbopack + `src/` dir + `@/*` alias.

**Files:**

- Output of `create-next-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack`
- `src/lib/utils.ts` with the `cn()` helper
- `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/loading.tsx` (default content)
- `src/components/error-boundary.tsx`, `src/components/loading.tsx`
- `middleware.ts` stub at the project root with the standard matcher
- `.env.local` with `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`
- `clsx` + `tailwind-merge` installed

**Variables:** `name`, `packageManager` (default `npm`).

**Optional includes (`--with`):** `shadcn` (with `preset` variable).

### `node-express`

Express slice of [shai-scaffold-node-app](../src/shai-node/skills/shai-scaffold-node-app/SKILL.md).

**Stack:** TS ESM + Express + cors + helmet + compression + morgan + zod + jest + eslint + prettier.

**Files:**

- `package.json` (ESM, `tsx watch` dev, `node dist/index.js` start, jest, lint, typecheck scripts)
- `tsconfig.json` (Node16 ESM strict — same shape as `ts-workspace` apps tsconfig)
- `jest.config.ts` (ts-jest ESM preset, `testEnvironment: node`)
- `eslint.config.js` (flat config)
- `src/index.ts` — Express app entry with helmet/cors/compression/morgan + `/health` route
- `src/lib/index.ts`, `src/types/index.ts` barrel placeholders
- `.env.example`, `.gitignore`, `.prettierrc`

**Variables:** `name`, `description`, `port` (default `3000`).

**Optional includes (`--with`):** `docker` (Dockerfile + `.dockerignore`).

### `node-genkit`

Genkit slice of [shai-scaffold-node-app](../src/shai-node/skills/shai-scaffold-node-app/SKILL.md).

**Stack:** TS ESM + `genkit` + a chosen plugin.

**Files:**

- Same TS / Jest / ESLint / Prettier baseline as `node-express`
- `src/index.ts` defining a single `genkit()` instance and one example flow
- `.env.example` with the plugin's API key placeholder

**Variables:** `name`, `plugin` (`google-ai` | `openai` | `firebase`).

### `node-plain`

Plain-library slice of [shai-scaffold-node-app](../src/shai-node/skills/shai-scaffold-node-app/SKILL.md).

**Stack:** Bare TS ESM library/script with jest + eslint + prettier.

**Files:**

- TS / Jest / ESLint / Prettier baseline
- `src/index.ts` barrel + `src/lib/index.ts` placeholder

**Variables:** `name`, `description`.

### `firebase-functions`

Functions-only flow inside [shai-scaffold-firebase](../src/shai-firebase/skills/shai-scaffold-firebase/SKILL.md). The current `firebase` template bundles a React UI which isn't always wanted.

**Files:**

- `firebase.json` with Functions + Emulator suite (Functions, Firestore, UI)
- `functions/` directory with TS ESM, `src/index.ts` (re-exports), `src/config.ts` (region + runtime constants), `src/init.ts` (Admin SDK), `src/db.ts` (Firestore)
- `.firebaserc`, `.gitignore` (with `.secret.local`)

**Variables:** `name`, `projectId`, `region` (default `us-central1`).

**Optional includes (`--with`):** `firestore-rules`, `hosting`.

## Conventions for new templates

- **Honour the standards in `shai-package-json`** — `test` watches, `test:once` runs once, `build:prod` is the deploy build.
- **`private: true`** on every template root unless the template is for a publishable package.
- **Use `_name` for private fields** in any TypeScript boilerplate (never `#private`).
- **ESM by default** — all Node-side templates emit `"type": "module"` and `Node16` resolution.
- **Prettier baseline is template-owned** — include `prettier`, `eslint-config-prettier`, and `eslint-plugin-prettier` in template dependencies and generate `.prettierrc` from the template instead of repeating install/config snippets in skills.
- **Minimal placeholders** — boilerplate should compile, lint, and test green out of the box, but contain no business logic.
