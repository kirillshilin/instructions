---
applyTo: "**/*.fn.spec.ts"
description: "Firebase Cloud Function test conventions: thin-facade wiring tests, mocked services, firebase-functions-test wrapper, Zod-validated event data."
---

# Firebase Cloud Function Testing

Rules for `*.fn.spec.ts` files — unit tests for Firebase Cloud Function entry points (`*.fn.ts`).

A function spec validates **the wiring** — that the function calls the right service method with the right arguments. Business logic is tested in the service spec.

Apply [shai-typescript-testing](../../shai-typescript/instructions/shai-typescript-testing.instructions.md) for base structure (AAA, `describe`/`it` naming, `jest.Mocked<T>`). Apply [shai-firebase-functions](./shai-firebase-functions.instructions.md) for the function file conventions being tested.

---

## Rules

- One spec per function file: `<name>.fn.ts` ↔ `<name>.fn.spec.ts`
- Mock the service with `jest.mock(...)` — never use the emulator for unit tests
- Wrap the exported function with `firebase-functions-test` to invoke the handler — do not export a separate `_handle*` function; the service delegation is already the separation of concerns
- Validate Firestore document data with the same Zod schema imported from `src/fn/schemas/<name>.schema.ts` — same `safeParse` guard pattern as `onRequest` or `onCall`
- Cover at minimum: the happy path (delegates with validated data) and each guard clause (missing snapshot, failed schema, wrong method, unauthenticated)

---

## Example

```typescript
// schemas/on-user-created.schema.ts
import { z } from "zod";

export const UserCreatedSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
});

export type UserCreatedData = z.infer<typeof UserCreatedSchema>;
```

```typescript
// on-user-created.fn.ts
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FN_REGION, RUNTIME_OPTIONS } from "./config";
import { UserCreatedSchema } from "./schemas/on-user-created.schema";
import { userService } from "./services/user.service";

export const onUserCreated = onDocumentCreated({ document: "users/{userId}", region: FN_REGION, ...RUNTIME_OPTIONS }, async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;
  const result = UserCreatedSchema.safeParse(snapshot.data());
  if (!result.success) return;
  await userService.initializeNewUser(event.params.userId, result.data);
});
```

```typescript
// on-user-created.fn.spec.ts
import functionsTest from "firebase-functions-test";
import { userService } from "./services/user.service";
import { onUserCreated } from "./on-user-created.fn";

jest.mock("./services/user.service", () => ({
  userService: { initializeNewUser: jest.fn() },
}));

const testEnv = functionsTest();

describe("onUserCreated", () => {
  const mock = userService as jest.Mocked<typeof userService>;
  beforeEach(() => jest.clearAllMocks());
  afterAll(() => testEnv.cleanup());

  it("should delegate to initializeNewUser with validated snapshot data", async () => {
    // Arrange
    const snap = testEnv.firestore.makeDocumentSnapshot({ displayName: "Alice", email: "alice@example.com" }, "users/u1");
    // Act
    await testEnv.wrap(onUserCreated)({ data: snap, params: { userId: "u1" } });
    // Assert
    expect(mock.initializeNewUser).toHaveBeenCalledWith("u1", { displayName: "Alice", email: "alice@example.com" });
  });

  it("should return early when snapshot is missing", async () => {
    await testEnv.wrap(onUserCreated)({ data: null, params: { userId: "u1" } });
    expect(mock.initializeNewUser).not.toHaveBeenCalled();
  });
});
```
