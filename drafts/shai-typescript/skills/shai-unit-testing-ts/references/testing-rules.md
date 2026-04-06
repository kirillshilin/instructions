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
  const total = calculator.calculateTotal(items, taxRate);

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
    expect(() => processor.process(null!)).toThrow(ArgumentError);
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
expect(() => validator.validate(badInput)).toThrow(ValidationError);
expect(() => validator.validate(badInput)).toThrow('Email is required');

// Async errors
await expect(service.fetchUser('bad-id')).rejects.toThrow(NotFoundError);
await expect(service.fetchUser('bad-id')).rejects.toThrow('User not found');
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
  expect(validator.isValid(input)).toBe(expected);
});
```

**JSON file-based test cases for large data:**

When test inputs or expected outputs are large objects, deeply nested, or
multi-property structures, store them in JSON files instead of inlining them.
This keeps test files readable and makes test data reusable.

```
src/
├── tax-calculator.ts
├── tax-calculator.spec.ts
└── __test-data__/
    ├── tax-calculator.valid-orders.json
    └── tax-calculator.edge-cases.json
```

```json
// __test-data__/tax-calculator.valid-orders.json
[
  {
    "scenario": "domestic order with standard tax",
    "input": {
      "items": [{ "name": "Widget", "price": 100, "quantity": 2 }],
      "country": "US",
      "state": "CA"
    },
    "expected": {
      "subtotal": 200,
      "tax": 17.5,
      "total": 217.5
    }
  },
  {
    "scenario": "international order with zero tax",
    "input": {
      "items": [{ "name": "Gadget", "price": 50, "quantity": 1 }],
      "country": "DE",
      "state": null
    },
    "expected": {
      "subtotal": 50,
      "tax": 0,
      "total": 50
    }
  }
]
```

```typescript
// tax-calculator.spec.ts
import validOrders from './__test-data__/tax-calculator.valid-orders.json';

describe('TaxCalculator', () => {
  let calculator: TaxCalculator;

  beforeEach(() => {
    calculator = new TaxCalculator();
  });

  it.each(validOrders)(
    'should calculate correctly for $scenario',
    ({ input, expected }) => {
      const result = calculator.calculate(input);

      expect(result).toEqual(expected);
    }
  );
});
```

**Rules for JSON test data:**
- Place JSON files in a `__test-data__/` folder next to the spec file
- Name files as `{source-file}.{scenario-group}.json`
- Each JSON file is an array of test case objects with `scenario`, `input`,
  and `expected` fields
- Use JSON for data-only test cases — if the test needs custom setup or
  assertions, keep it inline
- Enable `resolveJsonModule: true` in `tsconfig.json` (or `tsconfig.test.json`)
  to import JSON files directly

---

## 8. Test Isolation

- Each test must be independent — no test should depend on another's state
- Use `beforeEach` for setup, not `beforeAll` (unless setup is truly expensive
  AND stateless, like reading a fixture file)
- **Create all mock objects inside `beforeEach`** — mocks declared at the
  `describe` scope and only assigned in `beforeEach` ensures no shared state
  leaks between tests. Do not declare and initialize mocks at the top level:

```typescript
describe('OrderService', () => {
  let service: OrderService;
  let mockRepo: jest.Mocked<OrderRepository>;
  let mockEmailer: jest.Mocked<EmailService>;

  beforeEach(() => {
    // Fresh mock objects for every test — no shared state
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<OrderRepository>;

    mockEmailer = {
      send: jest.fn(),
    } as jest.Mocked<EmailService>;

    service = new OrderService(mockRepo, mockEmailer);
  });

  // Each test gets its own mocks — completely isolated
});
```

- Never rely on test execution order
- Clean up side effects in `afterEach` if absolutely necessary (timers,
  global state)

---

## 9. Async Testing

```typescript
// ✅ async/await — preferred
it('should load user profile', async () => {
  mockRepo.findById.mockResolvedValue(mockUser);

  const profile = await service.loadProfile('user-1');

  expect(profile.name).toBe('Test User');
});

// ✅ Rejected promises
it('should propagate repository errors', async () => {
  mockRepo.findById.mockRejectedValue(new DatabaseError('connection lost'));

  await expect(service.loadProfile('user-1')).rejects.toThrow('connection lost');
});

// ✅ Timers
it('should retry after delay', async () => {
  jest.useFakeTimers();
  mockApi.fetch.mockRejectedValueOnce(new Error('timeout'));
  mockApi.fetch.mockResolvedValueOnce(mockData);

  const promise = retryClient.fetchWithRetry();
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
