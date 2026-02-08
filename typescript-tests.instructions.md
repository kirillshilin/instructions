---
name: TypeScript Tests
description: TypeScript test conventions with describe blocks for organization
applyTo: "**/*.{test,spec}.{ts,tsx}"
---

# Test Method Naming

- Use descriptive test names that explain the expected behavior.
- Format: `should <expected behavior> when <condition>`.
- Examples: `should return true when input is valid`, `should throw error when parameter is null`.

# Test Organization

- Tests for the same method MUST be combined into a `describe` block.
- The describe block should be named after the method being tested.
- Example structure:

```typescript
describe("methodName", () => {
  it("should return expected result when condition is met", () => {
    // Arrange
    // Act
    // Assert
  });
});
```

# Test Structure

- Use Arrange-Act-Assert (AAA) pattern.
- Use `describe` for grouping related tests.
- Use `it` or `test` for individual test cases.
- Keep tests focused and single-purpose.
- Use `beforeEach` and `afterEach` for test setup and teardown.
- Properly type test variables and mock data.
