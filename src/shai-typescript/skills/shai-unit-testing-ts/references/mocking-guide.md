# Mocking Guide

Patterns and strategies for mocking dependencies in TypeScript Jest tests.
Loaded by the [shai-unit-testing-ts](../SKILL.md) skill when tests require
dependency isolation.

---

## Mocking Strategy Decision Tree

```
Need to mock a dependency?
├── Is it YOUR code (interface/class you own)?
│   ├── Simple interface → Manual mock object (jest.Mocked<T>)
│   └── Complex class → jest.spyOn on specific methods
├── Is it a third-party module?
│   ├── Has a simple API → jest.mock('module')
│   └── Has complex API → Wrap in an adapter, mock the adapter
└── Is it a global/built-in (Date, Math, fetch)?
    └── jest.spyOn(global/object, 'method')
```

---

## 1. Manual Mock Objects (Preferred)

Best for interfaces and simple abstractions you own:

```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// In test file — type annotation ensures compile-time safety
let userRepository: jest.Mocked<UserRepository>;

beforeEach(() => {
  // Reconstruct full mock instance — fresh for every test
  userRepository = {
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  service = new UserService(userRepository);
});
```

**Why manual mocks are preferred:**
- Fully typed — the `let` declaration uses `jest.Mocked<T>`, so TypeScript
  verifies every assignment. If the interface changes (method added, signature
  updated), the test fails to compile until the mock is updated.
- Explicit — every mocked method is visible in the test setup
- No magic — no `jest.mock()` hoisting surprises

**Type safety rule:** Always declare mock variables with a type annotation
(`: jest.Mocked<T>`) and assign plain object literals **without** `as`
assertions. The type annotation ensures that changes to the original
interface surface as compile errors in tests:

```typescript
// ✅ Type-safe — if UserRepository adds a method, this won't compile
let userRepository: jest.Mocked<UserRepository>;
userRepository = { findById: jest.fn(), save: jest.fn(), delete: jest.fn() };

// ❌ Unsafe — `as` bypasses the check, missing methods go unnoticed
const repo = { findById: jest.fn() } as jest.Mocked<UserRepository>;
```

---

## 2. `jest.spyOn` — Partial Mocks

Use when you want to mock one method while keeping the rest real:

```typescript
const service = new CalculationService();
const spy = jest.spyOn(service, 'getExchangeRate').mockReturnValue(1.2);

const result = service.convertCurrency(100, 'USD', 'EUR');

expect(result).toBe(120);
expect(spy).toHaveBeenCalledWith('USD', 'EUR');

spy.mockRestore(); // Clean up
```

**When to use:**
- Testing a class where most methods are fine but one has an external dependency
- Verifying a method was called without replacing its implementation
- Temporarily overriding a method for a specific test

**Rules:**
- Always call `spy.mockRestore()` in `afterEach` or at the end of the test
- Prefer `mockReturnValue` / `mockResolvedValue` over `mockImplementation`
  when you only need to control the return value

---

## 3. Module Mocks — `jest.mock()`

Use for third-party packages or modules with side effects:

```typescript
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiClient', () => {
  beforeEach(() => {
    mockedAxios.get = jest.fn();
    mockedAxios.post = jest.fn();
  });

  it('should fetch data from API', async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: 1, name: 'Test' } });

    const client = new ApiClient();
    const result = await client.getUser('1');

    expect(result).toEqual({ id: 1, name: 'Test' });
    expect(mockedAxios.get).toHaveBeenCalledWith('/users/1');
  });
});
```

**Gotchas:**
- `jest.mock()` is hoisted to the top of the file automatically — it runs
  before imports. This is Jest magic, not standard JS behavior.
- For named exports: `jest.mock('./module', () => ({ namedExport: jest.fn() }))`
- For default exports: `jest.mock('./module', () => ({ default: jest.fn() }))`
  or `jest.mock('./module', () => jest.fn())`

---

## 4. Mocking Patterns for Common Scenarios

### Constructor injection

```typescript
class OrderService {
  constructor(
    private _repo: OrderRepository,
    private _emailer: EmailService,
    private _logger: Logger
  ) {}
}

// Test setup
const orderRepository: jest.Mocked<OrderRepository> = { ... };
const emailService: jest.Mocked<EmailService> = { send: jest.fn() };
const logger: jest.Mocked<Logger> = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const service = new OrderService(orderRepository, emailService, logger);
```

### Date and time

```typescript
it('should use current date for creation timestamp', () => {
  const fixedDate = new Date('2024-06-15T10:00:00Z');
  jest.useFakeTimers();
  jest.setSystemTime(fixedDate);

  const order = orderService.createOrder(items);

  expect(order.createdAt).toEqual(fixedDate);

  jest.useRealTimers();
});
```

### Environment variables

```typescript
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv, API_KEY: 'test-key' };
});

afterEach(() => {
  process.env = originalEnv;
});
```

### Callbacks and event emitters

```typescript
it('should call onSuccess callback with result', () => {
  const onSuccess = jest.fn();

  processor.process(data, { onSuccess });

  expect(onSuccess).toHaveBeenCalledWith({ status: 'done', count: 3 });
});

it('should emit "complete" event after processing', () => {
  const handler = jest.fn();
  emitter.on('complete', handler);

  emitter.process(data);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({ result: 'success' });
});
```

### Chained method calls

```typescript
// When the dependency uses a builder/fluent pattern
const queryBuilder: jest.Mocked<QueryBuilder> = {
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue([mockUser]),
};
```

---

## 5. Verification Strategy

**Prefer implicit verification** — verify the final black-box result rather
than asserting mock calls. If a mock returns data that the method under test
processes, assert the processed output. This tests behavior, not wiring:

```typescript
// ✅ Implicit — verify the result that depends on the mock
it('should return formatted order summary', async () => {
  orderRepository.findById.mockResolvedValue(mockOrder);

  const summary = await service.getOrderSummary('order-1');

  // The result proves the mock was called and its data was used
  expect(summary).toEqual({
    orderId: 'order-1',
    total: '$42.00',
    status: 'confirmed',
  });
});

// ❌ Avoid — testing wiring, not behavior
it('should call repository', async () => {
  orderRepository.findById.mockResolvedValue(mockOrder);
  await service.getOrderSummary('order-1');
  expect(orderRepository.findById).toHaveBeenCalledWith('order-1'); // redundant
});
```

**Use explicit `toHaveBeenCalled` only when:**
- The method under test returns `void` and the side effect IS the behavior
- There is no return value or state change to verify implicitly
- You need to assert a method was NOT called (negative verification)

```typescript
// ✅ Appropriate — void method, side effect is the behavior
it('should send notification email when order is placed', async () => {
  await service.placeOrder(orderData);

  expect(emailService.send).toHaveBeenCalledWith(
    expect.objectContaining({ to: 'customer@example.com', subject: 'Order Confirmed' })
  );
});

// ✅ Appropriate — negative verification
it('should not send email when order fails validation', async () => {
  await expect(service.placeOrder(invalidData)).rejects.toThrow();

  expect(emailService.send).not.toHaveBeenCalled();
});
```

**Additional explicit patterns (use sparingly):**

```typescript
// How many times?
expect(repository.save).toHaveBeenCalledTimes(1);

// Specific call arguments (Nth call)
expect(logger.info.mock.calls[0][0]).toBe('Processing started');
expect(logger.info.mock.calls[1][0]).toBe('Processing complete');
```

---

## 6. Anti-Patterns

**❌ Mocking everything:**
```typescript
// Don't mock pure utility functions — use real ones
jest.mock('./utils/string-helpers'); // Why? These are pure functions.
```

**❌ Casting to `any` to avoid type errors:**
```typescript
const mock = { findById: jest.fn() } as any; // Loses type safety
```
Use `jest.Mocked<T>` or `Partial<jest.Mocked<T>>` instead.

**❌ Implementation-coupled verification:**
```typescript
// Don't assert internal call order unless it's part of the contract
expect(cache.get).toHaveBeenCalledBefore(database.query);
```
Only verify call order when the order is a business requirement (e.g.,
"must check cache before database" is a real requirement, "must log
before saving" usually isn't).

**❌ Over-specifying mock return values:**
```typescript
// Don't set up return values you never use in assertions
repository.findAll.mockResolvedValue([user1, user2, user3]);
// ... but the test only checks that .save() was called
```
Only mock what the test needs. Unused mock setups are noise.
