---
name: shai-tdd-feature
description: >
  TDD (test-driven development) workflow: write all failing tests first, pause
  for user review, then implement. Use this skill when the user says "use TDD",
  "write tests first", "red-green", "test-driven", "I want to review tests
  before implementation", "build this with TDD", or when the feature involves
  high branching logic, complex input validation, many edge cases, or library
  development that demands intensive coverage. Especially valuable for parsers,
  calculators, validators, and any code where correctness across a wide input
  space matters more than speed of delivery.
---

# shai-tdd-feature

TDD workflow for building features with confidence. Write a comprehensive,
failing test suite first — covering the full input space — then pause so the
user can review and approve the spec before a single line of production code
is written. Only after approval do you implement.

This skill enforces the **Red → Review → Green → Refactor** cycle:
1. **Red** — write all tests; they all fail (no implementation yet)
2. **Review** — present the test suite to the user; wait for approval
3. **Green** — implement the minimum code to make every test pass
4. **Refactor** — clean up without breaking anything

See also: [shai-unit-testing-ts](../../../shai-typescript/skills/shai-unit-testing-ts/SKILL.md)
for general unit testing rules that apply inside each test file.

## When to Use

- User explicitly asks for TDD, "tests first", or "red-green" approach
- Feature has high branching logic (many `if`/`switch` paths)
- Building a library, parser, calculator, or validator with wide input coverage
- Multiple use cases / personas interact with the same logic differently
- Code correctness across a large input space is critical (finance, data processing)
- User wants to think through the API/contract before committing to implementation
- Debugging a complex bug by first writing a failing test that reproduces it

**Do NOT use when:**
- Rapid prototyping or throwaway scripts — write tests after if at all
- UI/visual components where behavior is hard to specify up-front
- The user explicitly asks to implement first and test later

## Workflow

### Progress Reporting (mandatory)

At the start of each workflow step, output a progress indicator in bold blue:

**🔹 Step M/N — {Step title}**

where M is the current step number and N is the total number of steps in the
workflow. This is mandatory for every step — never skip it.


### Step 1: Understand the Feature

Before writing any test, gather enough context to enumerate all meaningful
input variations. Ask (or infer from context):

- What is the **function signature** or API contract? (inputs, outputs, errors)
- What are the **happy-path cases** (normal, expected inputs)?
- What are the **boundary conditions** (min/max values, empty collections, zero)?
- What **error cases** must be handled (null, invalid format, out-of-range)?
- Are there **special input combinations** that trigger different behavior?
- What are the **known edge cases** the user already has in mind?

Produce a brief feature summary:

```
## Feature: {name}

Function/method signature:
  {signature}

Input axes (things that vary):
  - {parameter}: {value range or options}
  - {parameter}: {value range or options}

Expected behaviors:
  - {input condition} → {expected output or side effect}
  - {error condition} → {expected error type}
```

If anything is unclear, ask the user before proceeding — tests written on a
misunderstood spec waste everyone's time.

### Step 2: Design the Test Plan

Enumerate every test case systematically. For each parameter or branching
axis, list the cases you intend to cover. Aim for completeness, not
minimalism — the goal of TDD is to think through all scenarios *before*
implementation traps you.

```
## Test Plan: {FeatureName}

### Happy Path
1. {scenario description} — verifies {expected behavior}
2. {scenario description} — verifies {expected behavior}

### Boundary Conditions
3. {empty / zero / min / max scenario}
4. ...

### Error Cases
5. {invalid input type or format} → throws {ErrorType}
6. ...

### Special Combinations
7. {combination scenario}
```

Show this plan to the user. Adjust based on feedback before writing code.

### Step 3: Write the Failing Tests (RED)

Write the complete test file. Every test **must fail** at this point — there
is no production code yet. This is intentional and correct.

Read [references/tdd-patterns.md](references/tdd-patterns.md) for detailed
guidance on test structure, data patterns, and framework templates.

**Key rules for TDD test files:**

**Use `it.each` for parametric cases** — when a function's behavior varies
predictably across inputs, encode all cases as data, not duplicated test bodies:

```typescript
it.each([
  { scenario: 'valid integer',        input: '42',   expected: 42 },
  { scenario: 'negative integer',     input: '-7',   expected: -7 },
  { scenario: 'integer with spaces',  input: ' 3 ',  expected: 3  },
  { scenario: 'float truncated',      input: '3.9',  expected: 3  },
  { scenario: 'empty string',         input: '',     expected: null },
  { scenario: 'non-numeric string',   input: 'abc',  expected: null },
  { scenario: 'null input',           input: null,   expected: null },
])('should return $expected when input is $scenario', ({ input, expected }) => {
  // Arrange — (input is already set)

  // Act
  const result = parseInteger(input);

  // Assert
  expect(result).toBe(expected);
});
```

**Use JSON files for complex test data** — when inputs or expected values are
large objects, move them to `test-cases/`:

```
src/
├── expression-parser.ts            ← (doesn't exist yet — that's OK)
├── expression-parser.spec.ts
└── test-cases/
    ├── expression-parser.arithmetic.json
    └── expression-parser.error-cases.json
```

`test-cases/expression-parser.arithmetic.json`:
```json
[
  {
    "scenario": "simple addition",
    "input": "2 + 3",
    "expected": { "value": 5, "tokens": [2, "+", 3] }
  },
  {
    "scenario": "operator precedence",
    "input": "2 + 3 * 4",
    "expected": { "value": 14, "tokens": [2, "+", 3, "*", 4] }
  }
]
```

**Import the target module even though it doesn't exist yet:**
```typescript
import { parseInteger } from './parse-integer'; // ← file doesn't exist → test will fail to compile
```

This is intentional — the failing import is the first "red" state.

**Stub the test file structure so the user sees the full API shape:**

```typescript
import { ExpressionParser } from './expression-parser';

describe('ExpressionParser', () => {
  let parser: ExpressionParser;

  beforeEach(() => {
    parser = new ExpressionParser();
  });

  describe('parse', () => {
    it.each(arithmeticCases)(
      'should evaluate $scenario correctly',
      ({ input, expected }) => {
        const result = parser.parse(input);
        expect(result.value).toBe(expected.value);
      }
    );

    it.each(errorCases)(
      'should throw $expectedError when $scenario',
      ({ input, expectedError }) => {
        expect(() => parser.parse(input)).toThrow(expectedError);
      }
    );
  });
});
```

### Step 4: Stop — Present Tests to User for Review

**Do not write any production code yet.**

Present the complete test file(s) to the user with this summary:

```
## Test Suite Ready for Review

### Files created:
- `{path/to/file.spec.ts}` — {N} tests
- `test-cases/{scenario-group}.json` — {N} test cases

### Coverage summary:
- Happy path: {N} cases
- Boundary conditions: {N} cases
- Error cases: {N} cases
- Special combinations: {N} cases

### Test status: 🔴 All tests FAIL (expected — no implementation yet)

**Review checklist:**
- [ ] All expected behaviors are represented
- [ ] Edge cases you care about are included
- [ ] Error types and messages look correct
- [ ] Input/output shapes match what you intended
- [ ] Any missing scenarios?

**Waiting for your approval before implementing.**
```

Wait for explicit user approval. If the user requests changes:
- Add missing scenarios
- Adjust expected outputs
- Fix error types or messages
- Rename or reorganize as asked

Then present the updated test suite again. Repeat until approved.

### Step 5: Implement — Make Tests Pass (GREEN)

Once the user approves the tests, implement the minimum production code needed
to make every test pass.

**TDD implementation discipline:**
- Write only what the tests require — no extra features, no "just in case" code
- If a test forces you to handle a case you hadn't planned, that's the test
  doing its job — handle it minimally and continue
- Do not modify the tests to make them pass — fix the implementation instead
- Run tests frequently: after each method or logical unit, not just at the end

**After each batch of tests go green, run the full suite:**
```bash
npx jest path/to/file.spec.ts
```

Continue until all tests pass.

### Step 6: Refactor (Keep Tests Green)

Once all tests are green, refactor the implementation for clarity and quality:

- Extract methods that are too long (> ~20 lines of logic)
- Rename for clarity
- Remove duplication
- Add type annotations if missing
- Apply SOLID principles where appropriate (see
  [shai-software-design](../../shai-software-design/SKILL.md))

**Rule:** Run the full test suite after every refactor step. If any test turns
red, revert the last change and try a smaller step.

### Step 7: Report

```
## TDD Session Complete

### Feature: {name}
- **Tests**: {N} total — ✅ all passing
- **Files created**: {list}
- **Coverage**: happy path, {N} boundary conditions, {N} error cases

### Implementation summary:
{2-3 sentences describing what was built}

### Refactoring done:
{what was improved, or "none needed"}
```

## Output Format

At the end of the TDD session, produce:
1. The complete test file(s) in their final state
2. The complete implementation file(s)
3. The session summary report (Step 7 template)

Tests and implementation files must be co-located per the project's convention.

## Gotchas

- **Don't skip the review gate** — the pause after tests is the whole point.
  Reviewing tests as a spec surfaces misunderstandings before implementation
  locks them in. Never proceed to Step 5 without explicit user acknowledgment.
- **Red tests are not failures** — during Step 3, failing tests are the correct
  state. Never "fix" a test by loosening its assertion to make it pass; fix the
  implementation instead.
- **Don't over-stub** — in TDD, you're designing the API as you write tests.
  If you find yourself writing complex stubs before the interface exists,
  step back and simplify the design.
- **Parametric tests beat duplicated tests** — 20 input variations written as
  one `it.each` block are far easier to extend and review than 20 separate `it`
  blocks. Use `it.each` aggressively.
- **JSON test data for libraries** — when building a parser, calculator, or
  transformer, put 20–30+ test cases in JSON. The test file stays clean; the
  data file becomes the authoritative spec.
- **Import before implementation is valid** — TypeScript will fail to compile
  when the import target doesn't exist. This is the first "red" state. It's
  correct.
- **Test the contract, not the internals** — test inputs and outputs (or errors
  thrown). Never test private methods or internal implementation details.
- **One failing test at a time (strict TDD)** — for experienced practitioners,
  write one test, implement just enough to pass it, then write the next. The
  workflow above allows writing all tests first because the user review gate
  creates a natural checkpoint. Either approach is valid; follow the user's
  preference.
