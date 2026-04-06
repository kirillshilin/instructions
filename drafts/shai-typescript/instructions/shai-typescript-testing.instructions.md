---
applyTo: "**/*.spec.ts"
---
# TypeScript Testing Conventions

Rules applied to every `*.spec.ts` file. These complement the comprehensive
workflow in the [`shai-unit-testing-ts`](../skills/shai-unit-testing-ts/SKILL.md)
skill — invoke `/shai-unit-testing-ts` when writing or reviewing tests for a
full step-by-step guide including mock strategies, coverage checklists, and
typed mock patterns.

## Coverage Requirement

Every exported function and every public method of every exported class must
have at least one test. Test private helpers only through the public API.

## Test Naming

Descriptive names communicate intent without reading the test body.

- Format: `should <expected behavior> when <condition>`
- Examples: `should return null when user is not found`, `should throw when id is empty`

## Test Organization

- Wrap tests for the same class in a top-level `describe('{ClassName}', ...)` block
- Wrap tests for the same method in a nested `describe('{methodName}', ...)` block
- Use `it(...)` (not `test(...)`) for individual cases — it reads as a sentence
  alongside the describe name

```typescript
describe('UserService', () => {
  describe('getUser', () => {
    it('should return the user when the id is valid', async () => { ... });
    it('should throw NotFoundError when the user does not exist', async () => { ... });
  });
});
```

## Arrange-Act-Assert

Every test body follows AAA — three clearly separated phases:

```typescript
it('should calculate the discounted price', () => {
  // Arrange
  const product = { price: 100 };
  const discount = 0.2;

  // Act
  const result = calculatePrice(product, discount);

  // Assert
  expect(result).toBe(80);
});
```

Never merge Arrange and Act, and never put logic after the assertion.

## Mock Hygiene

- Call `jest.clearAllMocks()` in `beforeEach` — mock state must not bleed between tests
- Name the subject under test `sut` to distinguish it from collaborators
- Cast mocked modules with `as jest.Mocked<T>` for full type safety

## Async Tests

Use `async/await` — never `.then()` chains in test bodies (they silently swallow failures).

```typescript
it('should reject with an error when the request fails', async () => {
  mockHttp.get.mockRejectedValue(new Error('timeout'));
  await expect(sut.fetchData()).rejects.toThrow('timeout');
});
```

## Gotchas

- `jest.mock()` is hoisted to the top of the file by Jest — never rely on execution order
- `clearAllMocks` resets call counts but keeps the mock implementation; `resetAllMocks`
  also clears the implementation — default to `clearAllMocks` unless you need a clean slate
- Angular component tests and React component tests have additional rules in their
  own skills; these rules apply to the pure TypeScript layer they share
