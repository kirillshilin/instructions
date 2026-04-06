---
name: shai-unit-testing-ts
description: >
  Comprehensive guide to writing unit tests for TypeScript code using Jest.
  Use this skill when the user needs to write tests for a TypeScript class or
  function, asks how to mock a dependency, wants to set up Jest for a TS project,
  asks about test coverage, wants to create a spec.ts file, needs help with
  async tests, or asks "how should I test this?" for any TypeScript code.
  Angular- and React-specific testing (DOM, component rendering, change detection)
  are handled by their own skills — this skill covers the pure TypeScript layer
  that those skills build on.
---

# shai-unit-testing-ts

Writes correct, readable Jest tests for TypeScript code. Given a class or module,
this skill produces a complete spec file: describe/it structure, typed mocks,
AAA layout, and assertions — applying the rule that every public method of an
exported class and every exported function must be covered.

Designed to be invoked directly (`/shai-unit-testing-ts`) or referenced by
Angular/React testing skills for the shared TypeScript layer.

See [shai-typescript-testing.instructions.md](../../instructions/shai-typescript-testing.instructions.md)
for the standing rules applied automatically to every `*.spec.ts` file.

## When to Use

- Writing a new `*.spec.ts` file for a TypeScript class or utility function
- Asking "how do I test this?" for any TS code
- Setting up Jest for a TypeScript project
- Mocking a dependency (module, class, function, HTTP client)
- Writing async / Promise-based tests
- Deciding what to test and what to skip
- Increasing coverage for an existing spec file

## Coverage Rule

**Every exported function and every public method of every exported class must
have at least one test.** Private helpers are tested indirectly through the
public surface — do not test them directly unless they carry complex logic
that is impossible to observe from the outside.

## Workflow

### Step 1: Analyse the Module Under Test

Read the source file and identify:
- All **exported functions** and their signatures
- All **exported classes** and their **public methods** (exclude private/protected)
- All **dependencies** injected via constructor or imported directly (these need mocking)
- **Async operations** (Promises, async/await, observables)

Produce a test coverage checklist before writing any test:

```
## Coverage checklist for {ModuleName}
- [ ] {exportedFunction}({params}) — {happy path}
- [ ] {exportedFunction}({params}) — {edge case / error}
- [ ] {ClassName}.{publicMethod}() — {happy path}
- [ ] {ClassName}.{publicMethod}() — {error / edge}
```

### Step 2: Plan the Mock Strategy

For each dependency, decide the mock level using this decision table:

| Dependency type                          | Strategy                                      |
| ---------------------------------------- | --------------------------------------------- |
| Side-effectful module (fs, http, DB)     | `jest.mock('module-path')` + `jest.fn()`      |
| Class injected via constructor           | `jest.createMockFromModule` or manual mock    |
| Simple value-returning utility           | `jest.spyOn` (spy, not replace)               |
| Complex external library                 | Manual `__mocks__` file                       |
| Pure function with no side effects       | No mock — call the real thing                 |

Read [references/jest-patterns.md](references/jest-patterns.md) for full
typed mock patterns for each strategy.

### Step 3: Write the Spec File

Follow this structure every time:

```typescript
import { MyClass } from './my-class';
import { dependencyModule } from './dependency';

jest.mock('./dependency');

const mockDependency = dependencyModule as jest.Mocked<typeof dependencyModule>;

describe('MyClass', () => {
  let sut: MyClass;

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new MyClass(/* inject mocked dependencies */);
  });

  describe('publicMethodName', () => {
    it('should return expected value when condition is met', () => {
      // Arrange
      mockDependency.someMethod.mockReturnValue('mocked');

      // Act
      const result = sut.publicMethodName('input');

      // Assert
      expect(result).toBe('expected');
      expect(mockDependency.someMethod).toHaveBeenCalledWith('input');
    });

    it('should throw when input is invalid', () => {
      // Cast to unknown then to the parameter type to simulate a caller
      // bypassing TypeScript — tests runtime guard behaviour
      expect(() => sut.publicMethodName(null as unknown as string)).toThrow('expected message');
    });
  });
});
```

Rules to enforce in every spec:
- Variable holding the class under test is named `sut` — makes it instantly
  recognizable as the subject and separates it visually from mocks
- `jest.clearAllMocks()` in `beforeEach` — prevents mock state bleeding between tests
- One `describe` block per public method — groups failures by method in the test runner
- Each `it` block tests one behaviour — keep them short and single-assertion where possible
- Assertion comes last — Arrange first, then Act, then Assert

### Step 4: Handle Async Tests

For Promise-based code, always use `async/await` — avoid `.then()` chains in
tests because they silently swallow assertion failures.

```typescript
it('should resolve with user data when id is valid', async () => {
  // Arrange
  mockUserRepo.findById.mockResolvedValue({ id: '1', name: 'Alice' });

  // Act
  const result = await sut.getUser('1');

  // Assert
  expect(result.name).toBe('Alice');
});

it('should throw NotFoundError when user does not exist', async () => {
  mockUserRepo.findById.mockResolvedValue(null);

  await expect(sut.getUser('999')).rejects.toThrow('User not found');
});
```

For RxJS observables, use `firstValueFrom` / `lastValueFrom` or the
`jest-marbles` / `rxjs/testing` scheduler. Angular and React skills extend
these patterns with framework-specific helpers.

### Step 5: Verify Coverage

After writing all tests, walk the coverage checklist from Step 1. Mark each
item `[x]` only when there is a test that:
1. Calls the method/function in the stated condition
2. Has a concrete assertion (not just "does not throw")

Report any uncovered items to the user with a suggestion for each.

## Output Format

Produce a complete `*.spec.ts` file, not a fragment. Include:
- Imports (source + mocked modules)
- `jest.mock()` calls at the top
- Typed mock variables
- One `describe` per class or module
- Nested `describe` per public method / exported function
- `beforeEach` with `jest.clearAllMocks()` and SUT construction
- All `it` blocks with AAA layout

After the file, output the completed coverage checklist.

## Gotchas

- **`jest.mock()` is hoisted** — even if you write it after imports, Jest moves
  it to the top of the file. Never rely on execution order inside `jest.mock()`.
- **Type the mock or lose intellisense** — cast with `as jest.Mocked<T>` immediately
  after importing the mocked module; otherwise TypeScript won't know the methods
  are `jest.MockedFunction<...>`.
- **`clearAllMocks` vs `resetAllMocks` vs `restoreAllMocks`** — `clearAllMocks`
  resets call counts and instances but keeps implementation; `resetAllMocks`
  also removes the implementation; `restoreAllMocks` is only relevant for spies.
  Default to `clearAllMocks` in `beforeEach`.
- **Don't mock what you don't own** — avoid mocking third-party libraries directly;
  wrap them in an adapter interface and mock the adapter.
- **Private fields use `_name` convention** in this codebase — not TypeScript's
  `#private` syntax. Tests can access `_field` on the SUT if necessary for
  tricky assertion cases, but prefer testing through the public API.
- **Angular / React specifics are out of scope here** — component rendering,
  `TestBed`, `render()`, `fireEvent` belong in their respective skills.
