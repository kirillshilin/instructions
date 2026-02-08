---
name: C# Unit Tests
description: C# test conventions with Should_ naming and region organization
applyTo: "**/*Tests.cs"
---

# Test Method Naming
- All test methods MUST start with `Should_`.
- Use underscore separation for test method names.
- Format: `Should_ExpectedBehavior_WhenCondition`.
- Examples: `Should_ReturnTrue_WhenInputIsValid`, `Should_ThrowException_WhenParameterIsNull`.

# Test Organization
- Tests for the same method MUST be combined into a `#region`.
- Region name should be the method being tested.
- Example structure:
```csharp
#region MethodName

[Fact]
public void Should_ReturnExpectedResult_WhenConditionMet()
{
    // Arrange
    // Act
    // Assert
}

#endregion
```

# Test Structure
- Use Arrange-Act-Assert (AAA) pattern.
- Keep tests focused and single-purpose.
- Use meaningful variable names.
- Add comments to clarify complex setup or assertions.
