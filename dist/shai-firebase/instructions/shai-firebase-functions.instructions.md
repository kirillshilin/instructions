---
applyTo: "**/*.fn.ts"
description: "Firebase Cloud Function file conventions: thin-facade structure, naming, config import, service delegation, and test requirements."
---

# Firebase Cloud Function Conventions

Rules for `*.fn.ts` files. A function file is the **interface between the outside world and your logic** — it wires a trigger to a service and nothing more. All business logic lives in services, making it testable without the Firebase runtime.

Apply [TypeScript coding standards](../../shai-typescript/instructions/shai-typescript.instructions.md) alongside these rules.

---

## File Naming and Structure

- File name: `<function-name>.fn.ts` in kebab-case, placed in `src/fn/`
- One exported function per file — the export name is the camelCase equivalent of the file name
- Group into subdirectories only when the project has more than ~10 functions

```
src/fn/
├── schemas/
│   └── process-payment.schema.ts  ← Zod schema + inferred type
├── on-user-created.fn.ts           ← exports onUserCreated
├── process-payment.fn.ts           ← exports processPayment
└── index.ts                        ← re-exports only
```

---

## Thin Facade Pattern

A function body may only contain:

- Guard clauses for absent/null event data
- Auth checks for callable functions (throw before delegating)
- HTTP method validation (`req.method !== "POST"`)
- One delegating call to a service

No data transformation, no database calls, no business logic — that belongs in the service where it is unit-testable.

```typescript
// src/fn/on-order-created.fn.ts

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FN_REGION, RUNTIME_OPTIONS } from "./config";
import { orderService } from "./services/order.service";

export const onOrderCreated = onDocumentCreated({ document: "orders/{orderId}", region: FN_REGION, ...RUNTIME_OPTIONS }, async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;
  await orderService.processNewOrder(event.params.orderId, snapshot.data());
});
```

---

## Config Import

Region and runtime options MUST be imported from `./config` — never hardcoded in the function.

```typescript
import { FN_REGION, RUNTIME_OPTIONS } from "./config";

export const processPayment = onRequest({ region: FN_REGION, ...RUNTIME_OPTIONS, cors: true }, async (req, res) => {
  /* ... */
});
```

Override individual options only for legitimate exceptions (e.g. a scheduled job needing a longer timeout). Always keep the region from config.

---

## Request Validation — onRequest/onCall Functions

`onRequest` functions MUST validate the request body with a Zod schema before delegating. The parsed, typed value is what gets passed to the service — never the raw `req.body`.

- Define the schema in `src/fn/schemas/<name>.schema.ts`
- Use `safeParse` and return `400` on failure — never `parse` (throws unhandled errors)
- The schema file also exports the inferred TypeScript type — no manual interface duplication
- Auth and method guards run before schema validation

```typescript
// schemas/process-payment.schema.ts
import { z } from "zod";

export const ProcessPaymentSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
});

export type ProcessPaymentInput = z.infer<typeof ProcessPaymentSchema>;
```

```typescript
// process-payment.fn.ts
import { onRequest } from "firebase-functions/v2/https";
import { FN_REGION, RUNTIME_OPTIONS } from "./config";
import { ProcessPaymentSchema } from "./schemas/process-payment.schema";
import { paymentService } from "./services/payment.service";

export const processPayment = onRequest({ region: FN_REGION, ...RUNTIME_OPTIONS, cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const result = ProcessPaymentSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() });
    return;
  }
  await paymentService.processPayment(result.data);
  res.status(200).json({ ok: true });
});
```

The `safeParse` guard is an allowed guard clause under the thin-facade rule — parse, validate, return on failure, then delegate. No mapping or transformation before the service call.

---

## index.ts — Re-exports Only

`src/fn/index.ts` must contain only named re-exports from `.fn.ts` files — no logic, no service imports, no config. Firebase tree-shakes from each export; extra imports couple all functions at deploy time and inflate cold-start bundles.

```typescript
// src/fn/index.ts

export { onUserCreated } from "./on-user-created.fn";
export { onOrderCreated } from "./on-order-created.fn";
export { processPayment } from "./process-payment.fn";
```

---

## Testing

Every `<name>.fn.ts` must have a `<name>.fn.spec.ts`. See [shai-firebase-functions-testing](./shai-firebase-functions-testing.instructions.md) for the wiring-test pattern, mock setup, and `firebase-functions-test` usage.
