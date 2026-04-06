# Testing Rules Reference

Comprehensive rules for writing TypeScript unit tests with Jest. Loaded by
the [shai-unit-testing-ts](../SKILL.md) skill when writing or reviewing tests.

---

## 1. Coverage Requirements

**Non-negotiable rule:** Every public method of every exported class and every
exported function MUST have at least one test.

| Construct                      | Required Tests                                           |
| ------------------------------ | -------------------------------------------------------- |
| Exported class — public method | ≥1 test per method (happy path minimum)                  |
| Exported function              | ≥1 test (happy path minimum)                             |
| Private/protected methods      | NOT tested directly — covered via public API             |
| Internal (non-exported) items  | NOT tested directly — covered via exported consumers     |
| Getters/setters with logic     | Test if getter/setter contains branching or computation  |
| Trivial getters/setters        | Skip — no logic to test                                  |

**Target test count per method:**
- Simple method (1 code path): 1-2 tests
- Method with branching (if/else, switch): 1 test per branch minimum
- Method with error handling: 1 happy + 1 error per distinct error type
- Method with nullable params: add null/undefined edge case

---

## 2. Test Structure — AAA Pattern

Every test body follows Arrange-Act-Assert with visible section separation:

```typescript
it('should calculate total with tax', () => {
  // Arrange
  const items = [{ price: 100 }, { price: 200 }];
  const taxRate = 0.1;

  // Act
  const total = sut.calculateTotal(items, taxRate);

  // Assert
  expect(total).toBe(330);
});
```

**Rules:**
- Always include `// Arrange`, `// Act`, `// Assert` comments
- Blank line between each section
- `// Arrange` may be omitted when there is no setup (rare)
- `// Act` and `// Assert` may be combined for one-liner assertions:
  ```typescript
  it('should throw when input is null', () => {
    expect(() => sut.process(null!)).toThrow(ArgumentError);
  });
  ```

---

## 3. Test Naming Convention

Format: `should <expected behavior> when <condition>`

```typescript
// ✅ Good
it('should return empty array when no users match filter', () => { ... });
it('should throw ValidationError when email format is invalid', () => { ... });
it('should call logger.error when database connection fails', () => { ... });

// ❌ Bad
it('test getUserById', () => { ... });         // no expected behavior
it('works correctly', () => { ... });          // meaningless
it('returns data', () => { ... });             // too vague
```

**Guidelines:**
- Start with `should` — reads as a specification
- Include the condition that triggers the behavior (`when ...`)
- Name the specific error type, return value, or side effect
- If you can't name a specific behavior, the test may be too broad

---

## 4. Describe Block Organization

```typescript
describe('ClassName', () => {
  // Shared setup at the class level

  describe('methodName', () => {
    // Tests for this method

    // Optional nested describe for complex scenarios
    describe('when user is admin', () => {
      it('should allow deletion', () => { ... });
    });

    describe('when user is guest', () => {
      it('should throw ForbiddenError', () => { ... });
    });
  });

  describe('anotherMethod', () => {
    // ...
  });
});
```

**Rules:**
- Top-level `describe` = class name or module name
- Second-level `describe` = method name or function name
- Third-level `describe` = scenario grouping (optional, use for complex branching)
- Keep nesting to max 3 levels — deeper nesting signals the method is too complex

For standalone exported functions:

```typescript
describe('calculateTax', () => {
  it('should apply standard rate for domestic orders', () => { ... });
  it('should apply zero rate for tax-exempt items', () => { ... });
});

describe('formatCurrency', () => {
  it('should format with 2 decimal places', () => { ... });
});
```

---

## 5. Assertions

**Prefer specific matchers over generic ones:**

```typescript
// ✅ Specific
expect(result).toBe(42);                        // primitives
expect(result).toEqual({ id: 1, name: 'A' });  // objects/arrays
expect(result).toBeNull();
expect(result).toBeDefined();
expect(result).toHaveLength(3);
expect(result).toContain('admin');
expect(result).toMatchObject({ status: 'active' }); // partial match
expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
expect(fn).toHaveBeenCalledTimes(1);

// ❌ Avoid
expect(result == 42).toBe(true);               // loses diff output
expect(result !== null).toBeTruthy();           // hides intent
```

**Error assertions:**

```typescript
// Sync errors
expect(() => sut.validate(badInput)).toThrow(ValidationError);
expect(() => sut.validate(badInput)).toThrow('Email is required');

// Async errors
await expect(sut.fetchUser('bad-id')).rejects.toThrow(NotFoundError);
await expect(sut.fetchUser('bad-id')).rejects.toThrow('User not found');
```

---

## 6. Test Data

**Use factory functions for complex test data:**

```typescript
function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'member',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

// Usage
const admin = createUser({ role: 'admin' });
const newUser = createUser({ id: 'user-2', name: 'New User' });
```

**Rules:**
- Factory functions live at the top of the test file (after imports)
- Use `Partial<T>` overrides for flexibility
- Provide sensible defaults for all fields
- For shared factories across multiple test files, create a
  `__tests__/factories/` or `test-utils/` directory

**Declarative test cases with `it.each`:**

```typescript
it.each([
  { input: '',       expected: false, scenario: 'empty string' },
  { input: 'ab',     expected: false, scenario: 'too short' },
  { input: 'abc',    expected: true,  scenario: 'minimum length' },
  { input: 'abcdef', expected: true,  scenario: 'normal length' },
])('should return $expected when input is $scenario', ({ input, expected }) => {
  expect(sut.isValid(input)).toBe(expected);
});
```

---

## 7. Test Isolation

- Each test must be independent — no test should depend on another's state
- Use `beforeEach` for setup, not `beforeAll` (unless setup is truly expensive
  AND stateless, like reading a fixture file)
- Reconstruct mocks in `beforeEach` rather than using `jest.clearAllMocks()`
- Never rely on test execution order
- Clean up side effects in `afterEach` if absolutely necessary (timers,
  global state)

---

## 8. Async Testing

```typescript
// ✅ async/await — preferred
it('should load user profile', async () => {
  mockRepo.findById.mockResolvedValue(mockUser);

  const profile = await sut.loadProfile('user-1');

  expect(profile.name).toBe('Test User');
});

// ✅ Rejected promises
it('should propagate repository errors', async () => {
  mockRepo.findById.mockRejectedValue(new DatabaseError('connection lost'));

  await expect(sut.loadProfile('user-1')).rejects.toThrow('connection lost');
});

// ✅ Timers
it('should retry after delay', async () => {
  jest.useFakeTimers();
  mockApi.fetch.mockRejectedValueOnce(new Error('timeout'));
  mockApi.fetch.mockResolvedValueOnce(mockData);

  const promise = sut.fetchWithRetry();
  jest.advanceTimersByTime(1000);
  const result = await promise;

  expect(result).toEqual(mockData);
  jest.useRealTimers();
});
```

**Rules:**
- Always `await` the assertion for async code — forgetting `await` makes the
  test pass even when the assertion fails
- Use `jest.useFakeTimers()` for timer-dependent code, clean up with
  `jest.useRealTimers()` in `afterEach`
- Prefer `mockResolvedValue` / `mockRejectedValue` over
  `mockImplementation(() => Promise.resolve(...))`
