
# Scaffold Node App

Scaffold a production-ready Node.js project using TypeScript in ESM mode. The skill supports four app types — each with a tailored folder structure, entry point, and starter dependencies. All types share a common foundation: strict TypeScript, ESLint, Prettier, Jest, `.env` config, and barrel exports.

**Supported app types:**

| Type        | Use case                               | Default libraries                                           |
| ----------- | -------------------------------------- | ----------------------------------------------------------- |
| **Genkit**  | Firebase AI flows, LLM pipelines       | `genkit` + user-chosen AI plugin                            |
| **Express** | REST APIs, webhooks, web servers       | `express`, `cors`, `helmet`, `compression`, `morgan`, `zod` |
| **CLI**     | Command-line tools, scripts with args  | `yargs`                                                     |
| **Plain**   | Libraries, scripts, utilities, workers | (none — bare TypeScript)                                    |

## When to Use

- User wants to create a new Node.js application from scratch
- User says "scaffold", "bootstrap", "init", "set up" a Node.js project
- User wants to create an Express API, Genkit app, CLI tool, or a plain TS library
- User mentions "new backend", "new server", "new API"

**Do NOT use when:**

- The project already has a Node.js setup — help extend it directly instead
- User wants a frontend app (use `scaffold-react-app` or `scaffold-nextjs-app`)
- User wants a Next.js API route — use `scaffold-nextjs-app`

## Workflow

<!-- missing: ../../../shared/\_progress.partial.md -->

### Assets

<!-- missing: ../../../shared/\_assets.partial.md -->

### Step 1: Gather Requirements

Ask the user for the **project name** if not provided. Use it as `{project}` throughout.

Then ask about the project configuration. Present defaults clearly — the user should be able to answer quickly:

**Required questions:**

1. **Project name** — e.g., `my-api`
2. **App type** — Genkit / Express / CLI / Plain

**Type-specific follow-ups:**

- **Genkit**: "Which AI plugin? (`@genkit-ai/google-ai`, `@genkit-ai/openai`, `@genkit-ai/firebase`, other)"
- **Express**: "Need any additional libraries beyond the defaults (cors, helmet, compression, morgan, zod)?"
- **CLI**: "What's the CLI command name? Any subcommands to scaffold?"
- **Plain**: "What's this library/script for?" (to inform folder structure)

**Additional questions:**

3. **Environment variables** — "What keys do you need in .env? (e.g., `API_KEY`, `GOOGLE_API_KEY`, `DATABASE_URL`, `PORT`)"
4. **Docker** — "Include Dockerfile + .dockerignore?" (default: no)
5. **Extra libraries** — "Any additional npm packages to include?"

### Step 2: Initialize the Project

Create the project directory and initialize it:

```bash
mkdir {project} && cd {project}
npm init -y
```

Update `package.json` with ESM mode and standard scripts:

```json
{
  "name": "{project}",
  "version": "0.0.1",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit"
  }
}
```

> For **CLI** apps, also add a `"bin"` field pointing to `dist/index.js` and include a shebang in the entry point.

Install TypeScript and base development tooling:

```bash
npm install -D typescript tsx @types/node
```

> **Why `tsx`?** It's the fastest way to run TypeScript in development — zero config, ESM-native, watch mode built in. Production runs compiled JS via `node dist/index.js`.

### Step 3: Configure TypeScript

Create `tsconfig.json` with strict ESM settings — contents: [shared/assets/tsconfig.node-app.json](../../../../shared/assets/tsconfig.node-app.json)

### Step 4: Set Up ESLint + Prettier

<!-- missing: ../../../shared/\_eslint-prettier.partial.md -->

### Step 5: Set Up Jest

Install Jest with TypeScript support:

```bash
npm install -D jest ts-jest @types/jest
```

Create `jest.config.ts`:

```typescript
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/index.ts"],
};

export default config;
```

Add to `package.json`:

```json
{
  "scripts": {
    "test": "NODE_OPTIONS='--experimental-vm-modules' jest"
  }
}
```

> **ESM + Jest**: The `--experimental-vm-modules` flag is needed for Jest to handle ESM modules. The `ts-jest` ESM preset handles the TypeScript transformation.

### Step 6: Create Folder Structure

Create the directory structure based on the chosen app type. **Every directory gets a barrel file (`index.ts`)** that re-exports its public API.

Read the reference file for the chosen app type:

- **Genkit** — read [references/genkit-app.md](references/genkit-app.md)
- **Express** — read [references/express-app.md](references/express-app.md)
- **CLI** — read [references/cli-app.md](references/cli-app.md)
- **Plain** — read [references/plain-app.md](references/plain-app.md)

Each reference file contains the target folder tree, all boilerplate files with full source code, and type-specific notes.

**Common folders (all app types):**

```
{project}/
├── src/
│   ├── lib/               ← shared utilities
│   │   └── index.ts       ← barrel
│   ├── types/             ← shared type definitions
│   │   └── index.ts       ← barrel
│   └── index.ts           ← entry point (type-specific)
├── dist/                  ← compiled output (gitignored)
├── .env                   ← environment variables (gitignored)
├── .env.example           ← env template (committed)
├── .gitignore
├── tsconfig.json
├── jest.config.ts
├── package.json
└── README.md
```

### Step 7: Install App-Type Dependencies

Based on the app type, install the required packages:

**Genkit:**

```bash
npm install genkit {user-chosen-plugin}
```

Common plugins: `@genkit-ai/google-ai` (Gemini), `@genkit-ai/openai`, `@genkit-ai/firebase`.

**Express:**

```bash
npm install express cors helmet compression morgan zod
npm install -D @types/express @types/cors @types/compression @types/morgan
```

**CLI:**

```bash
npm install yargs
npm install -D @types/yargs
```

**Plain:** No additional dependencies.

### Step 8: Create Entry Point and Boilerplate

Create all files specified in the app-type reference file from Step 6. The reference files contain the full source code for every file — follow them exactly.

Key principles for all generated code:

- Use `_name` convention for private fields (not `#private`)
- Use barrel exports (`index.ts`) at every directory level
- Use explicit type imports: `import type { Foo } from "./foo.js"`
- Include `.js` extensions in relative imports (required for ESM)
- Add a brief JSDoc only for the entry point

### Step 9: Create .env and Optional Addons

#### .env + .env.example

Create `.env` with the user's requested variables:

```bash
# Environment Variables
# Copy this file to .env and fill in your values

{USER_REQUESTED_KEY}=
```

Create `.env.example` as a committed template with the same keys but no values.

Add to `.gitignore`:

```
node_modules/
dist/
.env
*.tsbuildinfo
```

#### Docker (if requested)

Create `Dockerfile`:

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

Create `.dockerignore`:

```
node_modules
dist
.env
.git
*.md
```

#### README.md

Generate a minimal README:

```markdown
# {project}

{one-line description based on app type}

## Quick Start

\`\`\`bash npm install cp .env.example .env

# Fill in your .env values

npm run dev \`\`\`

## Scripts

| Command          | Description             |
| ---------------- | ----------------------- |
| `npm run dev`    | Start in dev mode (tsx) |
| `npm run build`  | Compile TypeScript      |
| `npm start`      | Run compiled output     |
| `npm test`       | Run tests               |
| `npm run lint`   | Lint with ESLint        |
| `npm run format` | Format with Prettier    |
```

### Step 10: Verify and Present Summary

Run verification checks:

```bash
npm install
npx tsc --noEmit
npm run lint
npm test
```

If any check fails, fix the issue before presenting the result.

Present the summary:

```
## Scaffolding Complete

### Project: {project}
- **Type**: {Genkit / Express / CLI / Plain}
- **Language**: TypeScript (ESM)
- **Testing**: Jest + ts-jest
- **Linting**: ESLint + Prettier
- **Docker**: {yes / no}

### Structure:
{show the folder tree}

### Environment:
{list .env variables}

### Next steps:
1. `cd {project} && npm install`
2. Copy `.env.example` to `.env` and fill in your values
3. `npm run dev` to start in development mode
4. Edit `src/index.ts` to start building
```

## Gotchas

- **ESM imports need `.js` extensions** — when importing `./foo.ts`, write `import { bar } from "./foo.js"`. TypeScript resolves this correctly at compile time but Node.js requires the `.js` extension at runtime with `"type": "module"`.
- **`tsx` for dev, `node` for prod** — use `tsx watch` during development for fast iteration. In production, compile with `tsc` and run with plain `node`. Never ship `tsx` as a production dependency.
- **Jest + ESM is experimental** — the `--experimental-vm-modules` flag is required. If Jest ESM support becomes unstable, fall back to Vitest as an alternative.
- **Barrel files re-export only** — `index.ts` barrels should contain only `export { ... } from "./module.js"` statements, never business logic. This keeps imports clean and avoids circular dependency issues.
- **Don't use `paths` aliases in Node.js** — unlike frontend bundlers, Node.js doesn't resolve `tsconfig.json` path aliases at runtime. Use relative imports with `.js` extensions. If you must have aliases, use `tsx` (which supports them) or a build-time resolver.
- **`dotenv` is not needed with `tsx`** — `tsx` supports `--env-file=.env` natively (Node.js 20.6+). For production, use `node --env-file=.env dist/index.js`. Only install `dotenv` if targeting Node.js < 20.6.
- **Genkit dev UI** — Genkit includes a built-in developer UI at `http://localhost:4000` when running `genkit start`. Use it to test flows interactively during development.
- **Express types** — `@types/express` must be installed separately as a dev dependency. The main `express` package doesn't include TypeScript types.
- **`_private` convention** — always use `_name` for private fields, never `#private`. This applies to all generated code examples.

## Related

- Instruction: `shai-typescript-coding-standards` (T-I01)
- Instruction: `shai-tsconfig-standards` (T-I03)
