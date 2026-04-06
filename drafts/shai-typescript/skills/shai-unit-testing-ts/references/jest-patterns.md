# Jest Patterns Reference

Detailed patterns for common Jest scenarios in TypeScript. Loaded on demand by
the `shai-unit-testing-ts` skill.

---

## Typed Mocks

### Mock an imported module

```typescript
import { emailService } from './email-service';

jest.mock('./email-service');

// Cast immediately to get typed mock methods
const mockEmailService = emailService as jest.Mocked<typeof emailService>;

it('should send a welcome email on register', async () => {
  mockEmailService.send.mockResolvedValue(undefined);

  await sut.register({ email: 'alice@example.com' });

  expect(mockEmailService.send).toHaveBeenCalledWith(
    expect.objectContaining({ to: 'alice@example.com' }),
  );
});
```

### Mock a class injected via constructor

```typescript
import { UserRepository } from './user-repository';

// jest.createMockFromModule replaces all methods with jest.fn()
const mockRepo = {
  findById: jest.fn(),
  save: jest.fn(),
} satisfies jest.Mocked<Pick<UserRepository, 'findById' | 'save'>>;

beforeEach(() => {
  sut = new UserService(mockRepo as unknown as UserRepository);
});
```

### Spy on a method without replacing the module

Use `jest.spyOn` when you want to observe calls but keep the real implementation
(or override only for one test):

```typescript
it('should log the error', () => {
  const logSpy = jest.spyOn(logger, 'error').mockImplementation(() => {});

  sut.processInvalidInput(null);

  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('invalid'));
  logSpy.mockRestore(); // restore original after test
});
```

---

## Async Patterns

### Resolving / rejecting Promises

```typescript
mockRepo.findById.mockResolvedValue({ id: '1', name: 'Alice' }); // resolves
mockRepo.findById.mockRejectedValue(new Error('DB error'));       // rejects
```

### Testing rejection

```typescript
await expect(sut.getUser('bad-id')).rejects.toThrow('User not found');
// OR if you need to inspect the error object:
await expect(sut.getUser('bad-id')).rejects.toMatchObject({ code: 'NOT_FOUND' });
```

### Timer-based code

```typescript
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('should debounce calls', () => {
  const callback = jest.fn();
  sut.scheduleWork(callback);

  jest.advanceTimersByTime(300);

  expect(callback).toHaveBeenCalledTimes(1);
});
```

---

## Assertion Patterns

### Partial object matching

```typescript
expect(result).toMatchObject({ status: 'ok', userId: '1' });
// Passes even if result has extra fields
```

### Array membership

```typescript
expect(result).toContain('expected-item');
expect(result).toEqual(expect.arrayContaining(['a', 'b']));
```

### Call argument matching

```typescript
expect(mockFn).toHaveBeenCalledWith(
  expect.objectContaining({ id: '1' }),
  expect.any(String),
);
```

### Negation

```typescript
expect(mockFn).not.toHaveBeenCalled();
expect(result).not.toBeNull();
```

---

## Module-Level Mocks (`__mocks__`)

For a module used across many test files, create a manual mock in the
`__mocks__` directory adjacent to the module:

```
src/
  services/
    email-service.ts
    __mocks__/
      email-service.ts    ← manual mock
```

```typescript
// __mocks__/email-service.ts
export const emailService = {
  send: jest.fn().mockResolvedValue(undefined),
};
```

In the test file, calling `jest.mock('./email-service')` will automatically
use the manual mock instead of the real module.

---

## Test Data Builders

For complex objects, use builder functions instead of inline literals:

```typescript
function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'user',
    ...overrides,
  };
}

it('should reject admin-only action for regular users', () => {
  const user = buildUser({ role: 'user' });
  expect(() => sut.performAdminAction(user)).toThrow('Forbidden');
});
```

Builders keep tests readable and resilient to model changes — update the
builder, not every test that uses the model.

---

## Coverage Configuration

Recommended `jest.config.ts` coverage thresholds for a mature TS project:

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',      // barrel files — usually just re-exports
  ],
};
```

Run with `jest --coverage` to see the report. Focus on **branch coverage** —
it surfaces untested conditional paths that line coverage misses.
