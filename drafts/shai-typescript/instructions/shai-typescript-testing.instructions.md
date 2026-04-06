---
applyTo: "**/*.spec.ts"
description: "TypeScript unit testing conventions: AAA pattern, Jest, describe/it structure, naming, and coverage rules."
---

# TypeScript Unit Testing

Conventions for `*.spec.ts` test files. These rules are applied automatically
when editing or creating TypeScript test files. For the comprehensive testing
workflow — including mocking strategy, test data factories, and step-by-step
guidance — invoke the
[shai-unit-testing-ts](../skills/shai-unit-testing-ts/SKILL.md) skill.

For Angular-specific testing (TestBed, component harness) or React-specific
testing (Testing Library), the corresponding framework instructions and skills
will apply on top of these rules.

---

## Test Framework

- Use **Jest** as the test runner and assertion library
- Use `jest.fn()`, `jest.spyOn()`, and `jest.mock()` for mocking — no
  additional mocking libraries unless the project already uses one
- Use `jest.Mocked<T>` for type-safe mock objects

---

## Coverage Rules

- Each **public method** of every exported class MUST have at least one test
- Each **exported function** MUST have at least one test
- Do NOT test private methods directly — test through the public API
- Do NOT test trivial getters/setters with no logic

---

## File Naming and Location

- Test file sits next to the source file: `user.service.ts` → `user.service.spec.ts`
- Always use `.spec.ts`, not `.test.ts`

---

## Test Structure

- Follow the **Arrange-Act-Assert (AAA)** pattern in every test
- Add `// Arrange`, `// Act`, `// Assert` comments to separate sections
- Use `describe` blocks named after the class or function under test
- Nest `describe` blocks by method name
- Use `it` with descriptive names: `should <behavior> when <condition>`

**Preferred:**
```typescript
describe('UserService', () => {
  let service: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = { findById: jest.fn(), save: jest.fn() } as jest.Mocked<UserRepository>;
    service = new UserService(mockRepo);
  });

  describe('findById', () => {
    it('should return user when ID exists', async () => {
      // Arrange
      mockRepo.findById.mockResolvedValue(mockUser);

      // Act
      const result = await service.findById('user-1');

      // Assert
      expect(result).toEqual(mockUser);
    });
  });
});
```

**Avoid:**
```typescript
test('getUserById works', async () => {
  const service = new UserService(mockRepo as any);
  const u = await service.findById('1');
  expect(u).toBeTruthy();
});
```
Why: No describe grouping, generic name, `as any` casting, vague assertion,
no AAA comments, creates service inline instead of in `beforeEach`.

---

## Naming Convention

- `should <expected behavior> when <condition>`
- Name specific return values, error types, or side effects
- Avoid generic names like `works`, `returns data`, `test method`

---

## Mocking

- Use `jest.Mocked<T>` for type-safe mock objects
- Reconstruct mocks in `beforeEach` — prefer explicit setup over `jest.clearAllMocks()`
- Name the object under test naturally (e.g., `service`, `calculator`, `validator`) —
  avoid abstract names like `sut`
- Avoid `as any` to silence mock type errors — use proper typing instead

---

## Async Tests

- Always `await` async assertions — a missing `await` makes false passes
- Use `mockResolvedValue` / `mockRejectedValue` for Promise-based mocks
- Use `jest.useFakeTimers()` for timer-dependent code, clean up in `afterEach`

---

## Test Data

- Use factory functions with `Partial<T>` overrides for complex test objects
- Use `it.each` for declarative, data-driven test cases
- Provide sensible defaults — each test only overrides what it needs
- For large, multi-property, or deeply nested test data, store inputs and
  expected outputs in JSON files under a `__test-data__/` folder next to the
  spec file. See the [shai-unit-testing-ts skill](../skills/shai-unit-testing-ts/SKILL.md)
  for the full pattern.

---

## Gotchas

- **Missing `await` on async assertions** — `expect(promise).rejects.toThrow()`
  without `await` silently passes. Always write `await expect(...)`.
- **`any` in tests** — test code has the same type strictness as production code.
  Use `jest.Mocked<T>` or factory functions, not `any` casts.
- **Snapshot tests for logic** — snapshots are for UI serialization. Use explicit
  assertions for business logic.
- **Test coupling to implementation** — test inputs and outputs, not internal
  method call order. Refactoring internals should not break tests.
