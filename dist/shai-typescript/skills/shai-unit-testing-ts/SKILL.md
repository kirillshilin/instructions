---
name: shai-unit-testing-ts
description: >
  Comprehensive guide for writing TypeScript unit tests with Jest. Use this skill when the user asks to create, write, add, or generate unit tests for TypeScript code; when they mention "spec.ts", "test coverage", "write tests", "add tests", "test this class", or "test this function"; or when they need help with mocking, test structure, or assertion patterns in TypeScript. For Angular or React component testing, use the framework-specific testing skills instead — this skill covers general-purpose TypeScript tests.
---

# unit-testing-ts

Write high-quality unit tests for general-purpose TypeScript code using Jest. Covers test file structure, naming conventions, mocking strategy, assertion patterns, coverage rules, and test execution. For Angular-specific testing (TestBed, component harness) or React-specific testing (Testing Library, render hooks), use the corresponding framework testing skills — they build on top of this skill's foundations.

See also: [typescript-testing instruction](../../instructions/typescript-testing.instructions.md) for the condensed rule set applied automatically to `*.spec.ts` files.

## When to Use

- User asks to create or write unit tests for a TypeScript class, function, or module
- User says "add tests", "write tests", "test this", "create spec file"
- User wants to improve test coverage for existing TypeScript code
- User asks about mocking, spying, or test data patterns in TypeScript
- User needs help structuring a test file or naming test cases
- A code review or PR feedback requests missing tests

**Do NOT use for:**

- Angular component/service testing with TestBed → use `unit-testing-angular`
- React component testing with Testing Library → use `unit-testing-react`
- Integration or E2E tests → different scope entirely

## Workflow

### Progress Reporting (mandatory)

At the start of each workflow step, output a progress indicator in bold blue:

**🔹 Step M/N — {Step title}**

where M is the current step number and N is the total number of steps in the
workflow. This is mandatory for every step — never skip it.


### Step 1: Analyze the Source Code

Before writing any tests, read the source file to identify:

1. **Exported classes** — list every `public` method (skip `private`/`protected` and methods prefixed with `_`)
2. **Exported functions** — every standalone exported function
3. **Dependencies** — constructor parameters, imported services, external modules that need mocking
4. **Edge cases** — nullable parameters, union types, error paths, boundary conditions

Produce a brief test plan:

```
## Test Plan for {FileName}

### Exported: {ClassName}
- methodA(params): {what it does} → {N test cases}
- methodB(params): {what it does} → {N test cases}

### Exported: {functionName}
- {what it does} → {N test cases}

### Dependencies to mock:
- {ServiceName} — used by {methods}
```

### Step 2: Create the Test File

**File naming:** Place the test file next to the source file with the `.spec.ts` suffix:

- `user.service.ts` → `user.service.spec.ts`
- `calculate-tax.ts` → `calculate-tax.spec.ts`
- `utils/string-helpers.ts` → `utils/string-helpers.spec.ts`

**File structure template:**

```typescript
import { ClassName } from "./class-name";

describe("ClassName", () => {
  // shared setup
  let service: ClassName;
  let dependency: jest.Mocked<DependencyType>;

  beforeEach(() => {
    dependency = {
      methodA: jest.fn(),
      methodB: jest.fn(),
    };

    service = new ClassName(dependency);
  });

  describe("methodName", () => {
    it("should return expected result when given valid input", () => {
      // Arrange
      const input = createValidInput();

      // Act
      const result = service.methodName(input);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    it("should throw when input is null", () => {
      expect(() => service.methodName(null!)).toThrow();
    });
  });
});
```

### Step 3: Write Tests Following the Rules

Read [references/testing-rules.md](references/testing-rules.md) for the complete rule set. Key rules summarized:

**Coverage rule — non-negotiable:** Each public method of every exported class and each exported function MUST have at least one test. No exceptions.

**Arrange-Act-Assert (AAA):** Every test follows the AAA pattern. Use blank lines to visually separate each section. Add `// Arrange`, `// Act`, `// Assert` comments.

**Test naming:** Use `should <expected behavior> when <condition>` format:

- `should return user when ID exists`
- `should throw NotFoundError when ID is invalid`
- `should call logger.warn when retry limit exceeded`

**One assertion per test (prefer):** Each `it` block should verify one logical behavior. Multiple `expect` calls are acceptable when they assert different facets of the same behavior (e.g., checking both the return value and a side effect of the same call).

**Describe blocks:** Group tests by method name. Nest `describe` blocks for complex scenarios:

```typescript
describe('UserService', () => {
  describe('findById', () => {
    it('should return user when ID exists', () => { ... });
    it('should return null when ID does not exist', () => { ... });
  });

  describe('create', () => {
    describe('when email is unique', () => {
      it('should save and return the user', () => { ... });
    });
    describe('when email already exists', () => {
      it('should throw DuplicateEmailError', () => { ... });
    });
  });
});
```

### Step 4: Mock Dependencies

Read [references/mocking-guide.md](references/mocking-guide.md) for the full mocking reference. Key patterns:

**Manual mocks (preferred for most cases):**

```typescript
const userRepository: jest.Mocked<UserRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};
```

**`jest.spyOn` for partial mocks:**

```typescript
const spy = jest.spyOn(dateUtils, "now").mockReturnValue(fixedDate);
// ... test ...
spy.mockRestore();
```

**Module mocks for external packages:**

```typescript
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({ data: mockResponse });
```

**Mock reset:** Always use `beforeEach` to reconstruct mocks. Prefer rebuilding the full mock object over `jest.clearAllMocks()` — explicit reconstruction is clearer than implicit state reset.

### Step 5: Handle Async Code

```typescript
// async/await — preferred
it("should fetch user data", async () => {
  api.getUser.mockResolvedValue(mockUser);

  const result = await service.fetchUser("123");

  expect(result).toEqual(mockUser);
});

// rejected promises
it("should throw when API fails", async () => {
  api.getUser.mockRejectedValue(new Error("Network error"));

  await expect(service.fetchUser("123")).rejects.toThrow("Network error");
});
```

### Step 6: Validate Coverage

After writing tests, verify:

- [ ] Every exported class has its public methods tested
- [ ] Every exported function has at least one test
- [ ] Happy path, error path, and edge cases are covered
- [ ] No test depends on another test's state (tests are isolated)
- [ ] All mocks are properly typed (`jest.Mocked<T>`)
- [ ] Test file compiles without type errors

### Step 7: Run Tests

Always run the tests after writing them. Never finish without executing the test suite to confirm everything passes:

```bash
npx jest path/to/file.spec.ts
```

If any test fails, fix the test or the source code and re-run until all tests pass. Do not leave failing tests behind.

**Coverage (only when explicitly requested):** If the user asks for coverage information, run with the `--coverage` flag:

```bash
npx jest path/to/file.spec.ts --coverage
```

Report the coverage numbers in the output. Do not run coverage by default — only when the user explicitly asks for it.

## Output Format

Produce a complete `.spec.ts` file ready to run with `npx jest`. After writing and running the tests, report the results summary:

```
## Test Results for {FileName}

- **Tests created**: {N} (list new `it` blocks added)
- **Total tests**: {N} (including any pre-existing tests)
- **Test run**: ✅ All passed | ❌ {N} failed (details)
```

If coverage was explicitly requested, append:

```
- **Coverage**: {statements}% statements, {branches}% branches, {functions}% functions, {lines}% lines
```

The `.spec.ts` file itself should:

- Import the system under test and its dependencies
- Set up typed mocks in `beforeEach`
- Cover every public method / exported function
- Use descriptive test names following the naming convention
- Follow AAA pattern in every test body

## Gotchas

- **Don't test private methods directly** — test them through the public API that calls them. If a private method is complex enough to need direct tests, it should probably be extracted into its own exported function.
- **Don't mock what you don't own (usually)** — prefer mocking your own abstractions over third-party library internals. Wrap third-party calls in a thin adapter and mock that.
- **Avoid snapshot tests for logic** — snapshots are for UI serialization, not for verifying business logic. Use explicit assertions.
- **`any` in tests is still banned** — use `jest.Mocked<T>`, `Partial<T>`, or factory functions instead of casting to `any` to silence type errors.
- **Don't couple tests to implementation details** — test behavior (inputs → outputs), not internal method call order. If refactoring the internals breaks tests without changing behavior, the tests are too coupled.
- **Natural naming** — name the object under test naturally (e.g., `service`, `calculator`, `validator`). Avoid abstract names like `sut` — a descriptive name communicates the test's subject immediately.
- **Timer-dependent code** — use `jest.useFakeTimers()` and `jest.advanceTimersByTime()` instead of real `setTimeout`/`setInterval`.
- **File naming** — always `.spec.ts`, not `.test.ts`. This project uses `.spec.ts` as the convention.
