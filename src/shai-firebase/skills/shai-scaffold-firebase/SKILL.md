---
id: F-S01
name: shai-scaffold-firebase
priority: should
status: done
related: [F-I03, F-I04, T-I01]
description: >
  Scaffold Firebase in a project using the Firebase MCP. Initialises Cloud Functions (TypeScript), Hosting, Firestore Rules, and the local emulator suite. Use when the user asks to "add Firebase", "set up Firebase", "scaffold Firebase", "init Firebase", or needs Functions and Hosting configured from scratch.
---

# shai-scaffold-firebase

Set up Firebase in a project via `#tool:firebase`. Focuses on **Cloud Functions** and **Hosting** — the two most common Firebase features for web apps. Also supports **Firestore Rules** and other Firebase "Build" components. Configures the local emulator suite so the user can develop and test entirely offline.

See also: [shai-firebase-function](../shai-firebase-function/SKILL.md) for Cloud Functions coding conventions and file-structure guidelines.

## When to Use

- User asks to add Firebase to an existing or new project
- User needs Cloud Functions, Hosting, Firestore Rules, or a combination
- User wants the Firebase emulator configured for local development
- User is starting a new Firebase project from scratch

**Do NOT use for:**

- Writing individual Cloud Function logic → use `shai-firebase-function`
- Non-Firebase backend setup (Express, Nest, etc.)

## Workflow

{../../../shared/\_progress.partial.md}

### Prefer the `scaf` CLI

{../../../shared/\_scaf-cli.partial.md}

### Step 1: Gather Requirements

Use `#tool:vscode/askQuestions` to ask the user:

1. **Which Firebase features do you need?**
   - Cloud Functions
   - Hosting
   - Firestore Rules
   - Any other Firebase "Build" components? (e.g. Storage, Authentication, Realtime Database, Extensions)

2. **Do you already have a Firebase project in the Firebase Console?**
   - Yes → ask for the project ID
   - No → we will create one via `#tool:firebase`

3. **Functions runtime:**
   - TypeScript (default, recommended)
   - JavaScript

4. **Functions region** (e.g. `us-central1`, `europe-west1`):
   - If unknown, default to `us-central1` and note it can be changed later in the functions config constants file.

### Step 2: Ensure Firebase CLI Is Installed

Use `#tool:firebase` for all Firebase operations. If the CLI is not available locally, install it:

```bash
npm install -g firebase-tools
```

Then authenticate:

```bash
firebase login
```

### Step 3: Initialise Firebase

Use `#tool:firebase` to initialise the project. Select only the features the user requested in Step 1.

During the interactive prompts:

- **Features:** select `Functions`, `Hosting`, `Firestore Rules`, and any other requested "Build" components
- **Project:** use the existing project ID or create a new one
- **Functions language:** TypeScript (default)
- **ESLint:** Yes
- **Install dependencies:** Yes
- **Hosting public directory:** `public` (or the framework build output folder)
- **Single-page app rewrites:** Yes if the user is building an SPA
- **Firestore Rules file:** `firestore.rules` (default)

### Step 4: Configure the Emulator Suite

Use `#tool:firebase` to configure emulators for every selected feature.

Select emulators matching the enabled features:

- **Functions emulator** (default port 5001)
- **Hosting emulator** (default port 5000)
- **Firestore emulator** if the user selected Firestore (port 8080)
- **Emulator UI** (port 4000)

Verify the `firebase.json` includes the emulators section:

```jsonc
{
  "emulators": {
    "functions": { "port": 5001 },
    "hosting": { "port": 5000 },
    "firestore": { "port": 8080 },
    "ui": { "enabled": true, "port": 4000 },
  },
}
```

### Step 5: Set Up the Functions Project Structure

After init, the CLI creates a `functions/` directory. Adjust it to follow the conventions in [references/project-structure.md](references/project-structure.md):

```
functions/
├── src/
│   ├── index.ts          ← re-exports all *.fn.ts functions
│   ├── config.ts      ← region, runtime options, constants
│   ├── init.ts           ← Firebase Admin SDK initialisation
│   ├── db.ts             ← Firestore helpers / typed refs
│   └── services/         ← business logic (injected into functions)
├── .secret.local          ← local secrets (gitignored)
├── package.json
└── tsconfig.json
```

Key actions:

1. Create `src/config.ts` with the chosen region:

```typescript
export const FN_REGION = "us-central1";

export const RUNTIME_OPTIONS = {
  timeoutSeconds: 60,
  memory: "256MiB" as const,
};
```

2. Create `src/init.ts`:

```typescript
/** Initialises the Firebase Admin SDK once. Imported by db.ts and other infra modules. */
import { initializeApp } from "firebase-admin/app";

export const app = initializeApp();
```

3. Create `src/db.ts`:

```typescript
import { getFirestore } from "firebase-admin/firestore";
import { app } from "./init";

export const db = getFirestore(app);
```

4. Add `.secret.local` to `.gitignore` (for the admin service account key)

5. Update `src/index.ts` to re-export functions:

```typescript
// Re-export all cloud functions
// Add new functions here: export { myFunction } from "./my-function.fn";
```

### Step 6: Add npm Scripts

Ensure `functions/package.json` includes emulator and deploy scripts:

```jsonc
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "start": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "emulators": "firebase emulators:start",
    "emulators:export": "firebase emulators:export ./emulator-data",
  },
}
```

### Step 7: Verify Setup

Run the emulator to confirm everything works:

```bash
cd functions && npm run build && cd ..
firebase emulators:start
```

Confirm the Emulator UI is accessible at `http://localhost:4000`.

Present a summary to the user:

```
## Firebase Setup Complete

### Features enabled:
- [x] Cloud Functions (TypeScript)
- [x] Hosting
- [x] Firestore Rules
- [x] Local Emulator Suite

### Project structure:
src/fn/
  ├── index.ts        — function re-exports
  ├── config.ts       — region & runtime constants
  ├── init.ts         — Admin SDK initialisation
  ├── db.ts           — Firestore instance
  └── services/       — business logic (empty, ready)

### Next steps:
- Create your first function with `shai-firebase-function`
- Run `firebase emulators:start` to develop locally
- Secrets are managed via CI/CD; see .secret.local for local dev
```

## Output Format

1. All files created or modified during setup
2. Summary checklist of enabled features and project structure
3. Next-steps guidance pointing to `shai-firebase-function`

## Gotchas

- **Use `#tool:firebase` for all Firebase operations** — do not manually create `firebase.json` or `.firebaserc`. The Firebase MCP / CLI handles project linking, feature flags, and emulator config correctly.
- **Don't install Firebase globally in CI** — CI/CD pipelines should use `npx firebase-tools` or a pinned version in `devDependencies`.
- **Admin key must be gitignored** — never commit service account JSON files. Use `.secret.local` for local development and inject secrets via CI/CD environment variables in production.
- **Region matters** — choosing a region close to users reduces latency. It is set once in `config.ts` and used by every function. Changing it later means redeploying all functions.
- **Emulator data is ephemeral** — use `emulators:export` / `emulators:import` to persist local data across restarts if needed.
