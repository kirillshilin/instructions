# TDD Patterns Reference

Deep-dive guide for the [shai-tdd-feature](../SKILL.md) skill. Load this file
when writing tests, structuring test data, or applying red-green-refactor to
a specific framework.

---

## 1. Red-Green-Refactor in Detail

### What "Red" Really Means

A test is "red" when it fails for the **right reason**: because the behavior it
specifies does not yet exist in the code. A failing test is not a problem —
it is a specification.

A test is failing for the **wrong reason** when:
- It fails due to a syntax error in the test itself
- It fails because a dependency is misconfigured
- It fails because the assertion is incorrect

Fix wrong-reason failures before proceeding. Only move to Green once all tests
are red for the right reason (missing implementation).

### What "Green" Means

Passing tests by the **minimum implementation** necessary. Do not write code
the tests don't require. If you catch yourself adding a feature "just in case",
stop — add a test for it first.

### What "Refactor" Means

Improve the implementation's **internal quality** while keeping every test
green. Refactoring does not change observable behavior — only structure.

Safe refactoring moves:
- Extract method / extract variable
- Rename for clarity
- Inline trivial helpers
- Remove duplication (DRY)
- Reorder imports

Unsafe moves that change behavior (do NOT do these during refactor):
- Changing error types
- Altering return value structure
- Modifying validation rules

---

## 2. Choosing the Right Test Data Format

Use this table to decide whether to inline data or use JSON files:

| Situation                                          | Format                        |
| -------------------------------------------------- | ----------------------------- |
| ≤ 5 cases, simple scalar inputs/outputs            | Inline `it.each` array        |
| 6–15 cases, simple scalars                         | Inline `it.each` array        |
| Any case with multi-property objects as input      | JSON file in `test-cases/`    |
| Any case with multi-property objects as expected   | JSON file in `test-cases/`    |
| 16+ cases regardless of complexity                 | JSON file in `test-cases/`    |
| Cases shared across multiple test files            | JSON file in `test-cases/`    |
| Cases needing custom assertions or async setup     | Keep inline (can't JSON-ify)  |

### Inline `it.each` — Template

Use for simple scalar inputs and outputs:

```typescript
it.each([
  { scenario: 'zero',             input: 0,    expected: '0'   },
  { scenario: 'positive integer', input: 42,   expected: '42'  },
  { scenario: 'negative integer', input: -1,   expected: '-1'  },
  { scenario: 'large number',     input: 1e6,  expected: '1000000' },
])('should format $scenario as "$expected"', ({ input, expected }) => {
  // Arrange — input is set

  // Act
  const result = formatNumber(input);

  // Assert
  expect(result).toBe(expected);
});
```

### JSON File — Template

**File structure:**
```
src/
├── {source-file}.ts
├── {source-file}.spec.ts
└── test-cases/
    ├── {source-file}.{scenario-group}.json
    └── {source-file}.{other-scenario-group}.json
```

**JSON schema:**
```json
[
  {
    "scenario": "human-readable description used in test name",
    "input": { /* ...input object or primitive... */ },
    "expected": { /* ...expected output object or primitive... */ }
  }
]
```

**Importing and using:**
```typescript
import validCases from './test-cases/expression-parser.valid-expressions.json';
import errorCases from './test-cases/expression-parser.error-cases.json';

describe('ExpressionParser', () => {
  let parser: ExpressionParser;

  beforeEach(() => {
    parser = new ExpressionParser();
  });

  describe('parse — valid expressions', () => {
    it.each(validCases)(
      'should evaluate $scenario',
      ({ input, expected }) => {
        // Act
        const result = parser.parse(input);

        // Assert
        expect(result).toEqual(expected);
      }
    );
  });

  describe('parse — error cases', () => {
    it.each(errorCases)(
      'should throw when $scenario',
      ({ input, expectedError }) => {
        expect(() => parser.parse(input)).toThrow(expectedError);
      }
    );
  });
});
```

**Enable JSON imports** in `tsconfig.json` (or `tsconfig.test.json`):
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

---

## 3. Systematic Input Space Coverage

When designing test cases for a function, enumerate every dimension of the
input space. For each parameter, identify:

| Dimension           | Cases to cover                                           |
| ------------------- | -------------------------------------------------------- |
| Null / undefined    | What happens if this parameter is null or undefined?     |
| Empty              | Empty string `""`, empty array `[]`, empty object `{}`  |
| Boundary (numeric)  | 0, 1, -1, `Number.MAX_SAFE_INTEGER`, `Number.MIN_SAFE_INTEGER` |
| Invalid type        | String when number expected, array when object expected  |
| Invalid format      | Malformed email, invalid date string, bad JSON           |
| Minimum valid       | Smallest valid value or shortest valid string            |
| Maximum valid       | Largest valid value or longest valid string              |
| Typical valid       | Representative happy-path value                          |

### Example: String parser input space

For `parseEmail(input: string): Email | null`:

```typescript
it.each([
  // Happy path
  { scenario: 'standard email',             input: 'user@example.com',     expected: { local: 'user', domain: 'example.com' } },
  { scenario: 'subdomain',                  input: 'user@mail.example.com',expected: { local: 'user', domain: 'mail.example.com' } },
  { scenario: 'plus addressing',            input: 'user+tag@example.com', expected: { local: 'user+tag', domain: 'example.com' } },
  // Boundary / edge cases
  { scenario: 'minimal valid',              input: 'a@b.co',               expected: { local: 'a', domain: 'b.co' } },
  { scenario: 'all uppercase',              input: 'USER@EXAMPLE.COM',     expected: { local: 'USER', domain: 'EXAMPLE.COM' } },
  // Invalid
  { scenario: 'missing @',                  input: 'userexample.com',      expected: null },
  { scenario: 'missing domain',             input: 'user@',                expected: null },
  { scenario: 'missing local',              input: '@example.com',         expected: null },
  { scenario: 'double @',                   input: 'user@@example.com',    expected: null },
  { scenario: 'empty string',               input: '',                     expected: null },
  { scenario: 'null input',                 input: null as any,            expected: null },
  { scenario: 'whitespace only',            input: '   ',                  expected: null },
])('should parse $scenario', ({ input, expected }) => {
  expect(parseEmail(input)).toEqual(expected);
});
```

---

## 4. Library Testing — High-Volume Test Cases

When building a library (parser, transformer, calculator, validator), the
normal rules of "minimum test count" don't apply. The goal is a comprehensive
behavioral specification that doubles as documentation.

### Target test counts by library type

| Library type              | Minimum test cases | Recommended         |
| ------------------------- | ------------------ | ------------------- |
| Input validator           | 15–20              | 25–40               |
| String parser / formatter | 20–30              | 30–50               |
| Math / calculation engine | 20–30              | 30–60               |
| Data transformer          | 15–25              | 25–40               |
| State machine             | 1 per transition   | + boundary states   |

### Anatomy of a library test file

```
{library-name}.spec.ts
├── describe('{LibraryName}')
│   ├── describe('{primaryMethod}')
│   │   ├── it.each (valid cases from JSON)
│   │   ├── it.each (boundary cases from JSON or inline)
│   │   └── it.each (error cases from JSON)
│   ├── describe('{secondaryMethod}')
│   │   └── ...
│   └── describe('integration — combined operations')
│       └── ...
test-cases/
├── {library}.valid-inputs.json      ← primary happy path cases
├── {library}.boundary-cases.json   ← edge values, min/max
└── {library}.error-cases.json      ← invalid inputs, expected errors
```

---

## 5. Error Testing Patterns

```typescript
// Sync — check error type
it('should throw ValidationError when input exceeds max length', () => {
  const tooLong = 'x'.repeat(256);
  expect(() => validator.validate(tooLong)).toThrow(ValidationError);
});

// Sync — check error message
it('should include field name in error message', () => {
  expect(() => validator.validate({ email: 'bad' }))
    .toThrow('email: invalid format');
});

// Async — rejected promise
it('should reject when API returns 404', async () => {
  api.fetch.mockRejectedValue(new NotFoundError('User not found'));

  await expect(service.getUser('bad-id')).rejects.toThrow(NotFoundError);
});
```

### Error case JSON template

```json
[
  {
    "scenario": "null input",
    "input": null,
    "expectedError": "Input must not be null"
  },
  {
    "scenario": "empty string",
    "input": "",
    "expectedError": "Input must not be empty"
  },
  {
    "scenario": "exceeds max length",
    "input": "xxxxxxxxxxxxxxxxxxxxxxxxxx...(256 chars)",
    "expectedError": "Input exceeds maximum length of 255"
  }
]
```

```typescript
import errorCases from './test-cases/validator.error-cases.json';

it.each(errorCases)(
  'should throw when $scenario',
  ({ input, expectedError }) => {
    expect(() => service.process(input)).toThrow(expectedError);
  }
);
```

---

## 6. TDD with Dependencies (Mocking)

When the feature under development has dependencies, mock them in the tests
even before the implementation class exists. This forces you to define the
dependency interface upfront — which is the design benefit of TDD.

```typescript
// Step 1 in TDD: define the interface you *wish* existed
interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// Step 2: mock it in tests
const userRepository: jest.Mocked<UserRepository> = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

// Step 3: write tests using the mock
it('should return null when user does not exist', async () => {
  // Arrange
  userRepository.findByEmail.mockResolvedValue(null);

  // Act
  const result = await service.findByEmail('unknown@example.com');

  // Assert
  expect(result).toBeNull();
});
```

The mock defines the contract. When you implement the real class, it must
satisfy that contract.

---

## 7. Framework-Specific Notes

### TypeScript + Jest (default)

- File naming: `{source}.spec.ts` next to source
- Test runner: `npx jest {file}.spec.ts`
- Inline data via `it.each([...])(...)`
- JSON data via `import cases from './test-cases/...'`
- Async: `async/await` + `mockResolvedValue` / `mockRejectedValue`

### .NET + xUnit

- File naming: `{ClassName}Tests.cs` in a separate test project
- Use `[Theory]` + `[InlineData(...)]` for parametric cases
- Use `[MemberData]` or `[ClassData]` pointing to a static data class for
  large object test cases (the equivalent of JSON test files)
- Use `FluentAssertions` for readable assertions
- Use `NSubstitute` for mocking

```csharp
[Theory]
[InlineData("",    false, "empty string")]
[InlineData("ab",  false, "too short")]
[InlineData("abc", true,  "minimum length")]
public void IsValid_ShouldReturnExpected_WhenInputIs(
    string input, bool expected, string scenario)
{
    var result = _validator.IsValid(input);
    result.Should().Be(expected, because: scenario);
}
```

### Angular + Jest (or Jasmine)

- Component tests: use `TestBed` only when DOM interaction is needed
- Service tests: instantiate directly (no TestBed) — same as regular TS tests
- Use `it.each` / `jasmine.each` same as above
- For HTTP: mock `HttpClient` with `HttpClientTestingModule`

---

## 8. Review Checklist for Test Suites

Use this checklist when presenting the test suite to the user in Step 4:

### Completeness
- [ ] All happy-path input combinations are covered
- [ ] Boundary conditions for every parameter are included
- [ ] Each distinct error type has at least one test
- [ ] Special combinations / interactions between parameters are covered

### Quality
- [ ] Each test has a single, clear assertion focus
- [ ] Test names read as specifications (`should X when Y`)
- [ ] AAA pattern is followed in every test body
- [ ] Parametric cases use `it.each` or JSON (not duplicated test bodies)
- [ ] Mock types are correct (`jest.Mocked<T>` annotation, not `as` assertion)

### Structure
- [ ] Tests are grouped by method/function in `describe` blocks
- [ ] JSON test data files follow `test-cases/{source}.{group}.json` naming
- [ ] JSON entries have `scenario`, `input`, and `expected` fields
- [ ] All tests are independent (no shared mutable state)

### Red State
- [ ] No production code exists yet
- [ ] All tests fail for the right reason (missing implementation, not syntax errors)
- [ ] Import paths are correct (file doesn't exist yet — that's expected)
