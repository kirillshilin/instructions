---
applyTo: "**/package.json"
description: "Exact dependency versions, standard npm scripts, and package.json conventions for Angular, React, Next.js, and Node projects."
---

# package.json Standards

Conventions for `package.json` across all JavaScript/TypeScript projects — Angular, React, Next.js, and Node.js. Ensures reproducible builds, consistent developer experience, and predictable CI pipelines.

---

## Dependency Versions — No Ranges

Always pin **exact** versions for every dependency. Never use `^` or `~` prefixes.

**Preferred:**

```json
{
  "dependencies": {
    "express": "4.18.2",
    "zod": "3.22.4"
  },
  "devDependencies": {
    "typescript": "5.4.5",
    "eslint": "9.1.0"
  }
}
```

**Avoid:**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "zod": "~3.22.4"
  }
}
```

Why: Range specifiers (`^`, `~`) allow silent minor/patch upgrades that can introduce breaking changes, inconsistent behavior across environments, and non-reproducible builds. Pinning exact versions ensures every developer and CI machine installs the same dependency tree. Use `npm outdated` and deliberate upgrades instead of implicit drift.

When adding a new package, install with `--save-exact` (or configure `.npmrc` with `save-exact=true` project-wide):

```bash
npm install express --save-exact
```

---

## Standard Scripts

Every project must expose a consistent set of npm scripts. Use the exact names below so that every team member and CI pipeline can rely on the same commands regardless of the underlying framework.

### Core Scripts (all projects)

| Script       | Command              | Purpose                                               |
| ------------ | -------------------- | ----------------------------------------------------- |
| `start`      | `npm start`          | Start the development server with hot reload          |
| `build`      | `npm run build`      | Build the project for development / default build     |
| `build:prod` | `npm run build:prod` | Production-optimized build (minified, tree-shaken)    |
| `test`       | `npm run test`       | Run tests in **watch mode** (default for development) |
| `test:once`  | `npm run test:once`  | Run tests **once** without watch (CI, pre-commit)     |
| `lint`       | `npm run lint`       | Run linter (ESLint) — check only, no auto-fix         |

### Optional Scripts (add when applicable)

| Script             | Command                    | When to add                                      |
| ------------------ | -------------------------- | ------------------------------------------------ |
| `e2e`              | `npm run e2e`              | Project uses Playwright (or other E2E framework) |
| `deploy`           | `npm run deploy`           | Project has a deployment target (e.g., Firebase) |
| `deploy:functions` | `npm run deploy:functions` | Firebase Functions deployment                    |
| `deploy:hosting`   | `npm run deploy:hosting`   | Firebase Hosting deployment                      |
| `lint:fix`         | `npm run lint:fix`         | Auto-fix linter errors                           |
| `format`           | `npm run format`           | Run code formatter (e.g., Prettier)              |
| `test:coverage`    | `npm run test:coverage`    | Run tests with coverage report                   |

### Rules

- **`npm start`** is the development entry point — do not use `npm run dev`. `start` is a built-in npm command (no `run` required) and universally recognized.
- **`npm run test`** runs in watch mode by default for rapid feedback during development. **`npm run test:once`** is the non-watch variant for CI and pre-commit hooks.
- Use colon `:` to namespace related scripts (`build:prod`, `test:once`, `deploy:functions`). Keep script names in kebab-case.
- Do not add scripts that are never used. Every script in `package.json` should be runnable and documented.

---

## Framework-Specific Examples

### Angular

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "test": "ng test",
    "test:once": "ng test --watch=false",
    "lint": "ng lint",
    "e2e": "npx playwright test"
  }
}
```

### React (Vite)

```json
{
  "scripts": {
    "start": "vite",
    "build": "tsc && vite build",
    "build:prod": "tsc && vite build --mode production",
    "test": "vitest",
    "test:once": "vitest run",
    "lint": "eslint .",
    "e2e": "npx playwright test"
  }
}
```

### Next.js

```json
{
  "scripts": {
    "start": "next dev",
    "build": "next build",
    "build:prod": "next build",
    "test": "vitest",
    "test:once": "vitest run",
    "lint": "next lint",
    "e2e": "npx playwright test"
  }
}
```

### Node.js (Express / API)

```json
{
  "scripts": {
    "start": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "build:prod": "tsc --project tsconfig.prod.json",
    "test": "vitest",
    "test:once": "vitest run",
    "lint": "eslint .",
    "deploy": "firebase deploy",
    "deploy:functions": "firebase deploy --only functions",
    "deploy:hosting": "firebase deploy --only hosting"
  }
}
```

---

## Gotchas

- **`npm start` vs `npm run dev`** — Many scaffolding tools (Vite, Next.js) generate a `dev` script. Rename it to `start` for consistency. `npm start` is a first-class npm command that works without `run`.

- **Watch mode as default `test`** — Some teams expect `npm run test` to be a single run. In our convention, `test` watches and `test:once` runs once. CI pipelines should always use `test:once`.

- **`--save-exact` is not retroactive** — Adding `save-exact=true` to `.npmrc` only affects future installs. Existing ranges in `package.json` must be manually cleaned up. Run `npm outdated`, pin current installed versions, and verify with a fresh `npm ci`.

- **`deploy` scripts assume Firebase** — If the project uses a different deployment target (Vercel, AWS, etc.), adjust the deploy command but keep the script name `deploy` for discoverability.

- **`build:prod` may be identical to `build`** — For frameworks like Next.js where the default build is already production-optimized, `build:prod` can alias `build`. Keep the script for consistency so CI can always call `npm run build:prod`.
