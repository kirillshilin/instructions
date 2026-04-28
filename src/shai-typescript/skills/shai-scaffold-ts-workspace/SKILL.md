---
id: T-S01
name: shai-scaffold-ts-workspace
priority: should
status: done
related: [T-I01, T-I03]
description: >
  Scaffold a multi-project TypeScript workspace using npm workspaces with shared base configs (tsconfig, ESLint, Prettier, EditorConfig, Jest). Creates apps/ and packages/ directories, asks which sub-projects to include, then hands off to app-specific scaffolding skills. Use this skill when the user says "create a TypeScript workspace", "scaffold a monorepo", "new multi-project setup", "init typescript monorepo", "set up a workspace", "new ts workspace" — even if they just say "new workspace" or "monorepo setup".
---

# Scaffold TypeScript Workspace

Scaffold a multi-project TypeScript workspace using npm workspaces. Produces a workspace root with shared base configs (strict TypeScript, ESLint flat config, Prettier, Jest, EditorConfig) and an `apps/` + `packages/` directory layout. Each sub-project extends the shared configs — individual applications are scaffolded by their corresponding skills.

**Handoff to app-specific skills after workspace is created:**

| Sub-project type | Scaffolding skill                      |
| ---------------- | -------------------------------------- |
| React SPA        | `shai-scaffold-react-app`              |
| Next.js app      | `shai-scaffold-nextjs-app`             |
| Node.js backend  | `shai-scaffold-node-app`               |
| Firebase backend | `shai-scaffold-node-app` (Genkit type) |
| CLI tool         | `shai-scaffold-node-app` (CLI type)    |
| Shared library   | Created inline (Step 6)                |

## When to Use

- User wants to create a new multi-project TypeScript workspace
- User says "monorepo", "workspace", "multi-project", or "multi-app"
- User has multiple TypeScript apps (e.g., frontend + backend + shared lib)
- User wants shared configs across TypeScript projects

**Do NOT use when:**

- User wants a single standalone project — use the app-specific skill directly
- User already has a workspace and wants to add a project — scaffold the app directly inside the existing workspace

## Workflow

{../../../shared/\_progress.partial.md}

### Assets

{../../../shared/\_assets.partial.md}

### Step 1: Gather Requirements

Ask the user for the **workspace name** if not provided. Use it as `{workspace}` throughout.

Then ask which sub-projects to include. Present the options as a checklist — the user should pick at least one:

**Required:**

1. **Workspace name** — e.g., `my-platform`

**Sub-project selection (pick all that apply):**

2. **Which applications?** Ask the user to list the sub-projects they need. Suggest common combinations:
   - React SPA (frontend)
   - Next.js app (frontend with SSR)
   - Node.js API (Express backend)
   - Firebase backend (Genkit / Cloud Functions)
   - CLI tool
   - Shared library (e.g., `@{workspace}/shared` for types, utils, validators)

For each selected app, ask for its **name** (e.g., `web`, `api`, `cli`, `shared`).

**Additional questions:**

3. **Scope prefix** — npm scope for internal packages (default: `@{workspace}/`). Used for cross-references like `@my-platform/shared`.
4. **Any extra root-level configs or tools?** (default: none — keep it minimal)

### Step 2: Initialize the Workspace

Create the workspace root and initialize npm with workspace paths:

```bash
mkdir {workspace} && cd {workspace}
npm init -y
```

Update the root `package.json` — contents: [shared/assets/package.workspace.json](../../../../shared/assets/package.workspace.json)

Replace `{workspace}` with the actual workspace name. Scripts follow the [shai-package-json](../../../shai-core/instructions/shai-package-json.instructions.md) convention — `test` watches, `test:once` runs once (for CI), `build:prod` delegates the production build to each sub-project.

> **Why `private: true`?** The workspace root is not published. Individual packages declare their own publishability.

Create the directory structure:

```bash
mkdir apps packages
```

Install TypeScript and shared dev tooling at the workspace root:

```bash
npm install -D typescript
```

### Step 3: Configure TypeScript Base

Create `tsconfig.base.json` at the workspace root. All sub-projects extend this — contents: [shared/assets/tsconfig.base.json](../../../../shared/assets/tsconfig.base.json)

> **Why `Node16` resolution?** It enforces explicit `.js` extensions in imports, which is correct for ESM. Frontend apps (React, Next.js) will override to `"module": "ESNext"` + `"moduleResolution": "Bundler"` in their own tsconfig — bundlers don't need file extensions.

Also create a minimal root `tsconfig.json` that references all sub-projects — contents: [shared/assets/tsconfig.workspace-root.json](../../../../shared/assets/tsconfig.workspace-root.json)

> **Populated later.** Each sub-project skill adds its own reference to this file. The root tsconfig is for IDE-level project resolution only — each app builds independently.

### Step 4: Set Up ESLint + Prettier

{../../../shared/\_eslint-prettier.partial.md}

Install ESLint with TypeScript support at the workspace root:

```bash
npm install -D eslint @eslint/js typescript-eslint
```

Create `eslint.config.js` at the workspace root:

```js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  prettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["**/dist/", "**/node_modules/", "**/.next/", "**/coverage/"],
  },
);
```

> **Why `projectService`?** It auto-discovers tsconfig files per sub-project, so one root ESLint config works for the entire workspace without listing individual tsconfig paths.

### Step 5: Set Up Jest Base Config

Install Jest at the workspace root:

```bash
npm install -D jest ts-jest @types/jest
```

Create `jest.config.ts` at the workspace root:

```ts
import type { Config } from "jest";

const config: Config = {
  projects: ["<rootDir>/apps/*/jest.config.ts", "<rootDir>/packages/*/jest.config.ts"],
};

export default config;
```

> **Multi-project Jest.** The root config delegates to per-project configs. Each sub-project defines its own `jest.config.ts` extending common settings. Run `npm test` at root to test everything, or `npm test -w apps/{name}` for a single project.

Create `jest.base.config.ts` at the workspace root — sub-projects extend this:

```ts
import type { Config } from "jest";

const baseConfig: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
};

export default baseConfig;
```

> Sub-projects import this and override what they need (e.g., React apps set `testEnvironment: "jsdom"`).

### Step 6: Scaffold Sub-Project Folders

For each sub-project selected in Step 1, create its directory and minimal `package.json`.

**For apps (under `apps/`):**

```bash
mkdir -p apps/{app-name}/src
```

Create `apps/{app-name}/package.json`:

```json
{
  "name": "{scope}/{app-name}",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

Create `apps/{app-name}/tsconfig.json` — contents: [shared/assets/tsconfig.subproject.json](../../../../shared/assets/tsconfig.subproject.json)

**For shared packages (under `packages/`):**

```bash
mkdir -p packages/{pkg-name}/src
```

Create `packages/{pkg-name}/package.json`:

```json
{
  "name": "{scope}/{pkg-name}",
  "version": "0.0.1",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "typecheck": "tsc --noEmit"
  }
}
```

Create `packages/{pkg-name}/tsconfig.json` — contents: [shared/assets/tsconfig.subproject.json](../../../../shared/assets/tsconfig.subproject.json)

Create a barrel `packages/{pkg-name}/src/index.ts`:

```ts
// Public API for {scope}/{pkg-name}
```

> **Cross-referencing packages:** Apps consume shared packages via their npm scope name (e.g., `import { validate } from "@my-platform/shared"`). npm workspaces resolves these to the local source automatically — no `workspace:*` protocol needed in `package.json` dependencies (npm handles it). Add the dependency when the app-specific scaffolding skill runs.

### Step 7: Copy Root Config Files and Create .gitignore

Copy asset files from this skill's `assets/` folder to the workspace root (`.prettierrc`, `.gitattributes`, `.editorconfig`).

Create `.gitignore`:

```
node_modules/
dist/
.next/
coverage/
.env
.env.local
*.tsbuildinfo
```

Create `README.md`:

Before creating `README.md`, read this reference first:

- `references/readme-template.md`

### Step 8: Next Steps — Hand Off to App-Specific Skills

After the workspace is scaffolded, tell the user to scaffold each sub-project using the appropriate skill. List the exact commands:

```
Workspace "{workspace}" is ready. Scaffold your apps next:

- React SPA:        /shai-scaffold-react-app (run inside apps/{app-name})
- Next.js app:      /shai-scaffold-nextjs-app (run inside apps/{app-name})
- Node.js backend:  /shai-scaffold-node-app (run inside apps/{app-name})
- Firebase backend: /shai-scaffold-node-app with Genkit type (run inside apps/{app-name})
- CLI tool:         /shai-scaffold-node-app with CLI type (run inside apps/{app-name})
```

> **Important:** When running app-specific skills inside a workspace, the skill should detect the existing workspace context (root `tsconfig.base.json`, root ESLint config, root Jest config) and extend rather than recreate. If the skill creates its own tsconfig, it must `"extends": "../../tsconfig.base.json"`. If it sets up ESLint, it should inherit the root config or skip setup entirely.

Install all workspace dependencies once after scaffolding sub-projects:

```bash
npm install
```

## Gotchas

- **Don't run `npm install` inside sub-project directories.** Always run from the workspace root — npm workspaces hoists dependencies to the root `node_modules/`.
- **Frontend apps override tsconfig module settings.** React and Next.js apps use `"module": "ESNext"` + `"moduleResolution": "Bundler"` to enable import without `.js` extensions. The base config uses `Node16` which requires them.
- **Jest ESM requires `--experimental-vm-modules`.** Each sub-project's test script must include `NODE_OPTIONS='--experimental-vm-modules'`. The root Jest config just delegates.
- **`private: true`** on the root `package.json` and all `apps/*` — only `packages/*` may be published.
- **Use `_name` convention** for private fields in all generated code, not `#private`.
