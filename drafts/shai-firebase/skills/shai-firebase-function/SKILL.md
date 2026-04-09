---
name: shai-firebase-function
description: >
  Scaffold and implement a Firebase Cloud Function following project conventions.
  Use when the user asks to "create a function", "add a cloud function",
  "write a Firebase function", "add an HTTP endpoint", "add a Firestore
  trigger", or any request to add server-side logic to a Firebase project.
---

# shai-firebase-function

Create a Firebase Cloud Function that follows a strict separation of concerns:
the function file is a **thin facade** that delegates to a **service** containing
all business logic. Configuration (region, runtime options) lives in a shared
constants file — never hardcoded in the function itself.

See also: [shai-add-firebase](../shai-add-firebase/SKILL.md) to set up a
Firebase project before creating functions.

## When to Use

- User asks to create a new Cloud Function (HTTP, callable, or trigger-based)
- User wants to add a Firestore trigger, Auth trigger, or scheduled function
- User needs to scaffold the function file, service, and wiring

**Do NOT use for:**

- Initial Firebase project setup → use `shai-add-firebase`
- Frontend Hosting configuration (no Cloud Functions involved)
- Non-Firebase serverless functions (AWS Lambda, Azure Functions, etc.)

## Workflow

### Step 1: Gather Function Details

Ask the user (or infer from context):

1. **Function name** — descriptive, kebab-case (e.g. `on-user-created`,
   `process-payment`, `send-welcome-email`)
2. **Trigger type:**
   - `onRequest` — HTTP endpoint
   - `onCall` — callable from client SDK
   - `onDocumentCreated / Updated / Deleted / Written` — Firestore trigger
   - `onSchedule` — cron / Cloud Scheduler
   - `onAuthUserCreated / Deleted` — Auth trigger
3. **What should the function do?** — brief description of the business logic

### Step 2: Check for Function Config

Look for the config constants file at `functions/src/fn-config.ts`.

If it **does not exist**, ask the user:

> What region should your functions deploy to? (e.g. `us-central1`,
> `europe-west1`, `asia-northeast1`)

Then create the config file:

```typescript
// functions/src/fn-config.ts

export const FN_REGION = "us-central1"; // ← user's chosen region

export const RUNTIME_OPTIONS = {
  timeoutSeconds: 60,
  memory: "256MiB" as const,
};
```

If the config file **already exists**, use the existing region and options.

### Step 3: Scaffold the Function File

Create `functions/src/{function-name}.fn.ts`.

Read [references/function-patterns.md](references/function-patterns.md) for
complete templates per trigger type. The general pattern:

```typescript
// functions/src/on-user-created.fn.ts

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FN_REGION, RUNTIME_OPTIONS } from "./fn-config";
import { userService } from "./services/user.service";

export const onUserCreated = onDocumentCreated(
  {
    document: "users/{userId}",
    region: FN_REGION,
    ...RUNTIME_OPTIONS,
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const userData = snapshot.data();
    await userService.initializeNewUser(event.params.userId, userData);
  },
);
```

**Key rules:**

- The function file is a **facade only** — it parses the event/request and
  delegates to a service. No business logic lives here.
- Region and runtime options are **always imported** from `fn-config.ts`.
- The file name ends with `.fn.ts`.
- One exported function per file.

### Step 4: Create or Update the Service

Create `functions/src/services/{domain}.service.ts` for the business logic.

Services are **constructed once at app start** and hold all domain logic:

```typescript
// functions/src/services/user.service.ts

import { db } from "../db";

class UserService {
  async initializeNewUser(userId: string, userData: Record<string, unknown>): Promise<void> {
    // Business logic here — e.g. send welcome email, create profile doc
    await db.collection("profiles").doc(userId).set({
      displayName: userData.displayName ?? "Anonymous",
      createdAt: new Date(),
    });
  }

  async deleteUserData(userId: string): Promise<void> {
    await db.collection("profiles").doc(userId).delete();
  }
}

export const userService = new UserService();
```

**Key rules:**

- Services are **singletons** — instantiated once at module level and exported
  as a const. Cloud Functions reuse the same instance across warm invocations.
- Services import `db` (and other infra) from `src/db.ts` — never initialise
  Firebase Admin themselves.
- Services are **testable** — they accept data as parameters, not raw
  Firebase event objects. The `.fn.ts` file handles event parsing.

### Step 5: Scaffold Supporting Infra Files (If Needed)

If the function needs Firestore access and `init.ts` does not exist yet,
create it:

```typescript
// functions/src/init.ts

import { initializeApp } from "firebase-admin/app";

export const app = initializeApp();
```

Then create `db.ts`:

```typescript
// functions/src/db.ts

import { getFirestore } from "firebase-admin/firestore";
import { app } from "./init";

export const db = getFirestore(app);
```

If the function needs other Firebase services (Auth, Storage, etc.), add them
as separate files at the `src/` root:

```typescript
// functions/src/auth.ts

import { getAuth } from "firebase-admin/auth";
import { app } from "./init";

export const auth = getAuth(app);
```

### Step 6: Register the Function in index.ts

Add the re-export to `functions/src/index.ts`:

```typescript
// functions/src/index.ts

export { onUserCreated } from "./on-user-created.fn";
export { processPayment } from "./process-payment.fn";
// Add new functions here
```

`index.ts` must contain **only re-exports** — no logic, no imports of
services or config.

### Step 7: Verify with the Emulator

Build and run the emulator to verify the function loads:

```bash
cd functions && npm run build && cd ..
firebase emulators:start
```

For HTTP / callable functions, test with curl or the Emulator UI:

```bash
curl http://localhost:5001/{project-id}/{region}/{functionName}
```

For trigger-based functions, use the Firestore Emulator UI at
`http://localhost:4000` to create/modify documents and observe the trigger.

### Step 8: Present Summary

```
## Function Created

### Files:
- `functions/src/{name}.fn.ts` — function facade
- `functions/src/services/{domain}.service.ts` — business logic
- `functions/src/index.ts` — updated with re-export

### Function details:
- **Name:** {functionName}
- **Trigger:** {triggerType}
- **Region:** {region} (from fn-config.ts)

### Test locally:
firebase emulators:start
```

## Output Format

1. The `.fn.ts` function file
2. The service file with business logic
3. Updated `index.ts` with the new re-export
4. Any new infra files (`init.ts`, `db.ts`, etc.) if created
5. Summary with local testing instructions

## Gotchas

- **Functions are facades, not logic holders** — if you find yourself writing
  more than ~10 lines of logic in a `.fn.ts` file, move it to a service.
  The function should parse the event, call the service, and return/respond.
- **Never hardcode the region** — always import `FN_REGION` from
  `fn-config.ts`. Hardcoded regions lead to inconsistent deployments.
- **Secrets belong in CI/CD, not in code** — use `firebase functions:secrets`
  or CI/CD environment variables for API keys and credentials. For local
  development, use `.secret.local` (gitignored). Never commit secrets.
- **Admin key must be gitignored** — if using a service account JSON for
  local emulator auth, store it as `.secret.local` or in a gitignored path.
  The `.gitignore` must include patterns like `*.secret.*`, `.secret.local`.
- **One function per file** — `on-user-created.fn.ts` exports exactly one
  function. This keeps functions independently deployable and easy to find.
- **Service singletons survive warm starts** — Cloud Functions may reuse the
  same container. Services instantiated at module level persist across
  invocations, which is efficient. Don't re-initialise on every call.
- **Always test with the emulator** — never test against production. The
  emulator suite (`firebase emulators:start`) replicates Functions, Firestore,
  Auth, and Hosting locally.
