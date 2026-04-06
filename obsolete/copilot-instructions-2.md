# Copilot Master Instructions

- For all variables that represent expression nodes (for example: `Expression`, `MethodCallExpression`, `BinaryExpression`), use explicit names prefixed with `e` (for example: `eSource`, `eProperty`, `eSkip`, `eTake`).
- For private fields, use the `_name` naming convention.
- Prefer single-word variable names where possible; use longer names only when required for clarity, disambiguation, or existing conventions.
- For each non-trivial expression node creation, add a comment immediately above it showing the equivalent code that expression represents (for example: `// source.Value`).
- Do not inline or nest non-trivial expression constructions.
- Create each non-trivial expression node on a separate line.
- Simple expression nodes such as `Expression.Constant(...)` and `Expression.Convert(...)` may stay concise.

## Unit Tests

- Use **xUnit** as the test framework.
- Each test class lives in its own file named after the class under test, suffixed with `Tests` (for example: `ClassFactoryTests.cs`, `PropertyDefinitionTests.cs`).
- Test project names follow the pattern `<ProjectUnderTest>.Tests`.
- Every test method name starts with `Should_` and describes the expected outcome (for example: `Should_Throw_When_Type_Name_Is_Empty`).
- Group test methods inside a single test class using `#region` blocks named after the scenario category (for example: `#region Method`, `#region AnotherMethod`).
- Do not put more than one logical class under test in a single test file — split into separate files when covering different types.
- Arrange test data inline; avoid shared mutable state between tests.
- Assert one logical outcome per test; use multiple `Assert` calls only when they verify the same behaviour.
- For new functionality, prefer adding new tests instead of modifying existing ones; only update existing tests when they are broken.
