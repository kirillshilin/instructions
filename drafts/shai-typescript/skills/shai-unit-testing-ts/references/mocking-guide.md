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

// In test file
const mockRepo: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

beforeEach(() => {
  // Reconstruct — don't use clearAllMocks
  mockRepo.findById = jest.fn();
  mockRepo.save = jest.fn();
  mockRepo.delete = jest.fn();

  sut = new UserService(mockRepo);
});
```

**Why manual mocks are preferred:**
- Fully typed — TypeScript catches mismatches between mock and interface
- Explicit — every mocked method is visible in the test setup
- No magic — no `jest.mock()` hoisting surprises

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
const mockRepo: jest.Mocked<OrderRepository> = { ... };
const mockEmailer: jest.Mocked<EmailService> = { send: jest.fn() };
const mockLogger: jest.Mocked<Logger> = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const sut = new OrderService(mockRepo, mockEmailer, mockLogger);
```

### Date and time

```typescript
it('should use current date for creation timestamp', () => {
  const fixedDate = new Date('2024-06-15T10:00:00Z');
  jest.useFakeTimers();
  jest.setSystemTime(fixedDate);

  const order = sut.createOrder(items);

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

  sut.process(data, { onSuccess });

  expect(onSuccess).toHaveBeenCalledWith({ status: 'done', count: 3 });
});

it('should emit "complete" event after processing', () => {
  const handler = jest.fn();
  sut.on('complete', handler);

  sut.process(data);

  expect(handler).toHaveBeenCalledTimes(1);
  expect(handler).toHaveBeenCalledWith({ result: 'success' });
});
```

### Chained method calls

```typescript
// When the dependency uses a builder/fluent pattern
const mockQueryBuilder: jest.Mocked<QueryBuilder> = {
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  execute: jest.fn().mockResolvedValue([mockUser]),
};
```

---

## 5. Mock Verification Patterns

```typescript
// Was it called?
expect(mockRepo.save).toHaveBeenCalled();

// How many times?
expect(mockRepo.save).toHaveBeenCalledTimes(1);

// With what arguments?
expect(mockRepo.save).toHaveBeenCalledWith(
  expect.objectContaining({ name: 'John', email: 'john@example.com' })
);

// Call order (when it matters)
expect(mockLogger.info).toHaveBeenCalledBefore(mockRepo.save);

// Was it NOT called?
expect(mockEmailer.send).not.toHaveBeenCalled();

// Specific call arguments (Nth call)
expect(mockLogger.info.mock.calls[0][0]).toBe('Processing started');
expect(mockLogger.info.mock.calls[1][0]).toBe('Processing complete');
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
expect(mockCache.get).toHaveBeenCalledBefore(mockDb.query);
```
Only verify call order when the order is a business requirement (e.g.,
"must check cache before database" is a real requirement, "must log
before saving" usually isn't).

**❌ Over-specifying mock return values:**
```typescript
// Don't set up return values you never use in assertions
mockRepo.findAll.mockResolvedValue([user1, user2, user3]);
// ... but the test only checks that .save() was called
```
Only mock what the test needs. Unused mock setups are noise.
