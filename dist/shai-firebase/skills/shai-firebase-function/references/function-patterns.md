# Firebase Cloud Function Patterns

Templates for every supported trigger type. Each function follows the same
structure: import config → define trigger → delegate to service.

## HTTP Function (`onRequest`)

```typescript
// functions/src/health-check.fn.ts

import { onRequest } from "firebase-functions/v2/https";
import { FN_REGION, RUNTIME_OPTIONS } from "./fn-config";

export const healthCheck = onRequest(
  { region: FN_REGION, ...RUNTIME_OPTIONS },
  (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  },
);
```

For functions with business logic, delegate to a service:

```typescript
// functions/src/process-payment.fn.ts

import { onRequest } from "firebase-functions/v2/https";
import { FN_REGION, RUNTIME_OPTIONS } from "./fn-config";
import { paymentService } from "./services/payment.service";

export const processPayment = onRequest(
  { region: FN_REGION, ...RUNTIME_OPTIONS, cors: true },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const { orderId, amount } = req.body;
    const result = await paymentService.process(orderId, amount);
    res.json(result);
  },
);
```

## Callable Function (`onCall`)

```typescript
// functions/src/send-invite.fn.ts

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FN_REGION, RUNTIME_OPTIONS } from "./fn-config";
import { inviteService } from "./services/invite.service";

export const sendInvite = onCall(
  { region: FN_REGION, ...RUNTIME_OPTIONS },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be signed in.");
    }

    const { email, role } = request.data;
    return inviteService.sendInvite(request.auth.uid, email, role);
  },
);
```

## Firestore Trigger (`onDocumentCreated`)

```typescript
// functions/src/on-order-created.fn.ts

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FN_REGION, RUNTIME_OPTIONS } from "./fn-config";
import { orderService } from "./services/order.service";

export const onOrderCreated = onDocumentCreated(
  {
    document: "orders/{orderId}",
    region: FN_REGION,
    ...RUNTIME_OPTIONS,
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    await orderService.processNewOrder(event.params.orderId, snapshot.data());
  },
);
```

Other Firestore triggers follow the same pattern:

- `onDocumentUpdated` — receives `event.data.before` and `event.data.after`
- `onDocumentDeleted` — receives `event.data` (the deleted snapshot)
- `onDocumentWritten` — receives `event.data.before` and `event.data.after`

```typescript
// functions/src/on-profile-updated.fn.ts

import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { FN_REGION, RUNTIME_OPTIONS } from "./fn-config";
import { profileService } from "./services/profile.service";

export const onProfileUpdated = onDocumentUpdated(
  {
    document: "profiles/{profileId}",
    region: FN_REGION,
    ...RUNTIME_OPTIONS,
  },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    await profileService.handleProfileChange(
      event.params.profileId,
      before,
      after,
    );
  },
);
```

## Scheduled Function (`onSchedule`)

```typescript
// functions/src/daily-cleanup.fn.ts

import { onSchedule } from "firebase-functions/v2/scheduler";
import { FN_REGION } from "./fn-config";
import { cleanupService } from "./services/cleanup.service";

export const dailyCleanup = onSchedule(
  {
    schedule: "every day 02:00",
    region: FN_REGION,
    timeoutSeconds: 540,
  },
  async () => {
    await cleanupService.removeExpiredRecords();
  },
);
```

## Auth Trigger

```typescript
// functions/src/on-user-deleted.fn.ts

import { beforeUserDeleted } from "firebase-functions/v2/identity";
import { FN_REGION } from "./fn-config";
import { userService } from "./services/user.service";

export const onUserDeleted = beforeUserDeleted(
  { region: FN_REGION },
  async (event) => {
    await userService.deleteUserData(event.data.uid);
  },
);
```

## Service Pattern

Every service follows the same structure — a class instantiated once at
module level:

```typescript
// functions/src/services/order.service.ts

import { db } from "../db";

class OrderService {
  async processNewOrder(
    orderId: string,
    orderData: Record<string, unknown>,
  ): Promise<void> {
    // All business logic lives here
    const total = this.calculateTotal(orderData);

    await db.collection("order-summaries").doc(orderId).set({
      total,
      status: "processing",
      processedAt: new Date(),
    });
  }

  private calculateTotal(orderData: Record<string, unknown>): number {
    // Business logic — testable without Firebase
    const items = (orderData.items as Array<{ price: number; qty: number }>) ?? [];
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
}

export const orderService = new OrderService();
```

## Config Constants File

All function settings live in a single file:

```typescript
// functions/src/fn-config.ts

/** Default region for all Cloud Functions */
export const FN_REGION = "us-central1";

/** Default runtime options — override per-function if needed */
export const RUNTIME_OPTIONS = {
  timeoutSeconds: 60,
  memory: "256MiB" as const,
};

/**
 * Secrets are injected via CI/CD environment variables.
 * For local development, use .secret.local (gitignored).
 *
 * Access secrets in functions via:
 *   import { defineSecret } from "firebase-functions/params";
 *   const apiKey = defineSecret("API_KEY");
 */
```

## Secrets Management

- **Local development:** store secrets in `.secret.local` (gitignored)
- **CI/CD pipelines:** inject secrets as environment variables or use
  `firebase functions:secrets:set SECRET_NAME`
- **In code:** use `defineSecret` from `firebase-functions/params`:

```typescript
import { defineSecret } from "firebase-functions/params";

const stripeKey = defineSecret("STRIPE_SECRET_KEY");

export const processPayment = onRequest(
  { region: FN_REGION, secrets: [stripeKey] },
  async (req, res) => {
    const key = stripeKey.value(); // available at runtime
    // ...
  },
);
```