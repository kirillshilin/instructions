---
name: unit-testing
description: >
  Workflow for writing xUnit unit tests in C# following the Should_ naming
  convention, AAA pattern, and region organisation. Use this skill when writing
  new unit tests or improving existing test coverage for a .NET class or method.
---

# Unit Testing (.NET / xUnit)

## When to Use

- Writing unit tests for a new or existing C# class.
- Improving test coverage for an untested method or edge case.
- Refactoring existing tests to follow the project's naming and structure
  conventions.

## Process

1. **Read the class under test** — understand the public interface, constructor
   dependencies, and all meaningful code paths (happy path, null input,
   boundary values, error conditions).

2. **Plan test cases** — list every case to cover before writing code:
   - Happy path (expected behaviour under normal input).
   - Null or empty inputs that should be rejected.
   - Boundary values (zero, negative, max).
   - Each conditional branch that changes observable output.
   - Each exception that can be thrown.

3. **Create the test file** — mirror the source path under `tests/`:
   - Source: `src/Services/OrderService.cs`
   - Test: `tests/Services/OrderServiceTests.cs`
   - Namespace: `MyApp.Tests.Services`

4. **Set up the test class** — declare `Mock<T>` fields for each dependency
   and a private factory method to construct the SUT:
   ```csharp
   public class OrderServiceTests
   {
       private readonly Mock<IOrderRepository> _repo = new();
       private OrderService CreateSut() => new(_repo.Object);
   }
   ```

5. **Write tests** — for each planned case, write a method inside a
   `#region <MethodName>` block:
   - Name: `Should_<ExpectedBehavior>_When<Condition>`
   - Structure: Arrange → Act → Assert (blank lines between sections)
   - Use FluentAssertions for all assertions
   - Use `[Theory]` + `[InlineData]` for parameterised cases

   ```csharp
   #region PlaceOrder

   [Fact]
   public void Should_ReturnOrderId_WhenOrderIsValid()
   {
       // Arrange
       var id = Guid.NewGuid();
       _repo.Setup(r => r.AddAsync(It.IsAny<Order>(), default)).ReturnsAsync(id);

       // Act
       var result = CreateSut().PlaceOrder(new PlaceOrderCommand(Guid.NewGuid(), []));

       // Assert
       result.Should().Be(id);
   }

   [Fact]
   public void Should_ThrowArgumentNullException_WhenCommandIsNull()
   {
       // Arrange
       var sut = CreateSut();

       // Act
       var act = () => sut.PlaceOrder(null!);

       // Assert
       act.Should().ThrowExactly<ArgumentNullException>();
   }

   #endregion
   ```

6. **Run the tests** — execute the specific test class to confirm all pass:
   ```bash
   dotnet test --filter "FullyQualifiedName~OrderServiceTests"
   ```

7. **Fix failures** — if a test fails, check whether the test or the
   implementation is wrong before changing either.

8. **Run the full suite** — `dotnet test` to confirm no regressions.

## Output Format

```csharp
// tests/<Folder>/<ClassName>Tests.cs
using FluentAssertions;
using Moq;
using Xunit;

namespace <Namespace>.Tests.<Folder>;

public class <ClassName>Tests
{
    private readonly Mock<I<Dependency>> _dep = new();
    private <ClassName> CreateSut() => new(_dep.Object);

    #region <MethodName>

    [Fact]
    public void Should_<ExpectedBehavior>_When<Condition>()
    {
        // Arrange

        // Act

        // Assert
    }

    #endregion
}
```

## Best Practices

- One assertion concept per test — if a test needs ten assertions, consider
  splitting it or using `Should().BeEquivalentTo()`.
- Never test private methods directly — test them through the public API.
- Mock only external dependencies (repositories, HTTP clients, clocks); do not
  mock the class under test or simple value objects.
- Use `It.IsAny<T>()` sparingly — prefer specific matchers to keep tests
  meaningful.
- For async methods, use `async Task` test methods and `await` the SUT; never
  use `.Result` in tests.
- Keep test setup in the test method body or a private helper — avoid
  `IClassFixture` for unit tests (reserve it for integration tests).
