---
name: unit-testing-dotnet
description: >
  Comprehensive guide for writing C# unit tests with xUnit, Moq, and FluentAssertions. Use this skill when the user asks to create, write, add, or generate unit tests for .NET / C# code; when they mention "Tests.cs", "test coverage", "write tests", "add tests", "test this class", or "test this service"; or when they need help with mocking, test structure, test data builders, or assertion patterns in C#. For integration tests with WebApplicationFactory or TestContainers, use the integration-testing skill instead — this skill covers unit-level testing only.
---

# unit-testing-dotnet

Write high-quality unit tests for C# code using xUnit, Moq, and FluentAssertions. Covers test file structure, naming conventions, mocking strategy, assertion patterns, test data builders, JSON resource loading, and test execution. For Angular- or React-specific testing, use the corresponding framework testing skills — this skill is the .NET counterpart of [unit-testing-ts](../../../shai-typescript/skills/unit-testing-ts/SKILL.md).

See also: D-I03 `dotnet-testing` instruction for the condensed rule set applied automatically to `*Tests.cs` files.

## When to Use

- User asks to create or write unit tests for a C# class, service, or handler
- User says "add tests", "write tests", "test this", "create test file"
- User wants to improve test coverage for existing .NET code
- User asks about mocking, spying, or test data patterns in C#
- User needs help structuring a test file or naming test cases
- A code review or PR feedback requests missing tests

**Do NOT use for:**

- Integration tests with `WebApplicationFactory` or TestContainers → different scope
- E2E / Playwright tests → use `write-e2e-test`
- TypeScript unit tests → use `unit-testing-ts`

## Workflow

{../../../shared/\_progress.partial.md}

### Step 1: Analyze the Source Code

Before writing any tests, read the source file to identify:

1. **Public classes** — list every `public` method (skip `private`/`internal` unless explicitly testing internal APIs via `[InternalsVisibleTo]`)
2. **Dependencies** — constructor parameters, injected services that need mocking
3. **Edge cases** — nullable parameters, guard clauses, error paths, boundary conditions
4. **Branching** — if/else, switch expressions, early returns that create distinct code paths

Produce a brief test plan:

```
## Test Plan for {ClassName}

### Public Methods
- MethodA(params): {what it does} → {N test cases}
- MethodB(params): {what it does} → {N test cases}

### Dependencies to mock:
- I{ServiceName} — used by {methods}

### Edge cases:
- {nullable param, boundary, error condition}
```

### Step 2: Create the Test File

**File naming:** Mirror the source project structure under `tests/`:

- `src/Services/OrderService.cs` → `tests/Services/OrderServiceTests.cs`
- `src/Handlers/CreateUserHandler.cs` → `tests/Handlers/CreateUserHandlerTests.cs`

**Namespace:** Mirror the source namespace with `.Tests` suffix:

- `MyApp.Services` → `MyApp.Tests.Services`

**File structure template:**

```csharp
using FluentAssertions;
using Moq;
using Xunit;

namespace MyApp.Tests.Services;

public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _repo = new();
    private readonly Mock<ILogger<OrderService>> _logger = new();

    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _service = new(_repo.Object, _logger.Object);
    }

    #region PlaceOrder

    [Fact]
    public void Should_PlaceOrder_ReturnOrderId_WhenOrderIsValid()
    {
        // Arrange
        var expected = Guid.NewGuid();
        var command = new PlaceOrderCommand(Guid.NewGuid(), []);
        _repo.Setup(r => r.AddAsync(It.Is<Order>(o => o.CustomerId == command.CustomerId), default))
             .ReturnsAsync(expected);

        // Act
        var actual = _service.PlaceOrder(command);

        // Assert
        actual.Should().Be(expected);
    }

    [Fact]
    public void Should_PlaceOrder_ThrowArgumentNullException_WhenCommandIsNull()
    {
        // Arrange
        PlaceOrderCommand command = null!;

        // Act
        var act = () => _service.PlaceOrder(command);

        // Assert
        act.Should().ThrowExactly<ArgumentNullException>();
    }

    #endregion
}
```

### Step 3: Write Tests Following the Rules

Read [references/testing-rules.md](references/testing-rules.md) for the complete rule set. Key rules summarized:

**Coverage rule — non-negotiable:** Each public method of every public class MUST have at least one test. No exceptions.

**Arrange-Act-Assert (AAA):** Every test follows the AAA pattern. Use blank lines to visually separate each section. Add `// Arrange`, `// Act`, `// Assert` comments. Always extract method parameters into named variables in Arrange — never inline `new` expressions or literals directly in the Act call.

**Test naming:** Use `Should_{Method}_{ExpectedBehavior}_When{Condition}` format:

- `Should_PlaceOrder_ReturnOrderId_WhenOrderIsValid`
- `Should_GetUser_ThrowNotFoundException_WhenIdDoesNotExist`
- `Should_ProcessPayment_CallLogger_WhenRetryLimitExceeded`

**One assertion concept per test (prefer):** Each `[Fact]` should verify one logical behavior. Multiple `.Should()` calls are acceptable when they assert different facets of the same behavior (e.g., checking both a return value and a side effect of the same call). Use `.Should().BeEquivalentTo()` for complex objects instead of many individual property checks.

**Region blocks:** Group tests by method name using `#region MethodName` / `#endregion`. Keeps the file navigable as it grows:

```csharp
public class UserServiceTests
{
    // ... setup ...

    #region FindById

    [Fact]
    public void Should_FindById_ReturnUser_WhenIdExists() { ... }

    [Fact]
    public void Should_FindById_ReturnNull_WhenIdDoesNotExist() { ... }

    #endregion

    #region Create

    [Fact]
    public void Should_Create_SaveAndReturnUser_WhenEmailIsUnique() { ... }

    [Fact]
    public void Should_Create_ThrowDuplicateEmailException_WhenEmailExists() { ... }

    #endregion
}
```

### Step 4: Mock Dependencies

Read [references/mocking-guide.md](references/mocking-guide.md) for the full mocking reference. Key patterns:

**Moq — field-level mocks with constructor initialization (preferred):**

```csharp
public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _repo = new();
    private readonly Mock<IClock> _clock = new();

    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _service = new(_repo.Object, _clock.Object);
    }
}
```

**Setup and verification:**

```csharp
// Return values
_repo.Setup(r => r.FindByIdAsync(userId, default))
     .ReturnsAsync(expectedUser);

// Verify calls
_repo.Verify(r => r.SaveAsync(It.Is<User>(u => u.Email == "test@example.com"), default),
             Times.Once);
```

**Strict vs Loose mocks:** Default to `MockBehavior.Default` (loose). Use `MockBehavior.Strict` only when you need to verify that no unexpected calls are made — it forces you to set up every call explicitly.

**Mock reset:** Each test gets fresh mock state because `Mock<T>` fields are reconstructed per test instance (xUnit creates a new class instance for every test). No manual reset needed.

### Step 5: Handle Async Code

```csharp
// async/await — preferred
[Fact]
public async Task Should_FetchUser_ReturnUserData_WhenApiSucceeds()
{
    // Arrange
    var userId = "123";
    var expected = new User(userId, "John");
    _api.Setup(a => a.GetUserAsync(userId, default))
        .ReturnsAsync(expected);

    // Act
    var actual = await _service.FetchUserAsync(userId);

    // Assert
    actual.Should().BeEquivalentTo(expected);
}

// exception testing
[Fact]
public async Task Should_FetchUser_ThrowHttpException_WhenApiFails()
{
    // Arrange
    var userId = "123";
    _api.Setup(a => a.GetUserAsync(userId, default))
        .ThrowsAsync(new HttpRequestException("Network error"));

    // Act
    var act = () => _service.FetchUserAsync(userId);

    // Assert
    await act.Should().ThrowAsync<HttpRequestException>()
             .WithMessage("Network error");
}
```

### Step 6: Use Theory and Data-Driven Tests

Read [references/test-data-guide.md](references/test-data-guide.md) for the full test data reference, including builders and JSON resources.

**`[InlineData]` for simple parameterised cases:**

```csharp
[Theory]
[InlineData(0, 0, 0)]
[InlineData(1, 2, 3)]
[InlineData(-1, 1, 0)]
public void Should_Add_ReturnSum_WhenGivenTwoNumbers(int a, int b, int expected)
{
    // Act
    var actual = Calculator.Add(a, b);

    // Assert
    actual.Should().Be(expected);
}
```

**`[MemberData]` for complex test data:**

```csharp
public static TheoryData<Order, decimal> ValidOrders => new()
{
    { new Order("A", 2, 10.0m), 20.0m },
    { new Order("B", 1, 99.99m), 99.99m },
};

[Theory]
[MemberData(nameof(ValidOrders))]
public void Should_CalculateTotal_ReturnCorrectAmount_WhenOrderIsValid(
    Order order, decimal expected)
{
    // Act
    var actual = _service.CalculateTotal(order);

    // Assert
    actual.Should().Be(expected);
}
```

**JSON resource files for large/declarative test data:**

```csharp
[Theory]
[MemberData(nameof(LoadTestCases))]
public void Should_Validate_ReturnExpectedResult_WhenGivenTestCase(
    string caseName, ValidationInput input, bool expected)
{
    // Act
    var actual = _validator.Validate(input);

    // Assert
    actual.IsValid.Should().Be(expected, because: caseName);
}

public static TheoryData<string, ValidationInput, bool> LoadTestCases()
{
    var json = File.ReadAllText("TestData/validation-cases.json");
    var cases = JsonSerializer.Deserialize<List<ValidationTestCase>>(json)!;
    var data = new TheoryData<string, ValidationInput, bool>();

    foreach (var c in cases)
        data.Add(c.Name, c.Input, c.ExpectedValid);

    return data;
}
```

### Step 7: Validate Coverage

After writing tests, verify:

- [ ] Every public class has its public methods tested
- [ ] Every public/internal method (if `[InternalsVisibleTo]`) has at least one test
- [ ] Happy path, error path, and edge cases are covered
- [ ] No test depends on another test's state (tests are isolated)
- [ ] All mocks are properly typed (`Mock<T>`)
- [ ] Test file compiles without errors
- [ ] `#region` blocks group tests by method name

### Step 8: Run Tests

Always run the tests after writing them. Never finish without executing the test suite to confirm everything passes:

```bash
dotnet test --filter "FullyQualifiedName~ClassName"
```

If any test fails, fix the test or the source code and re-run until all tests pass. Do not leave failing tests behind.

**Coverage (only when explicitly requested):** If the user asks for coverage information, run with the coverage collector:

```bash
dotnet test --collect:"XPlat Code Coverage"
```

Report the coverage numbers in the output. Do not run coverage by default — only when the user explicitly asks for it.

## Output Format

Produce a complete `*Tests.cs` file ready to run with `dotnet test`. After writing and running the tests, report the results summary:

```
## Test Results for {ClassName}

- **Tests created**: {N} (list new test methods added)
- **Total tests**: {N} (including any pre-existing tests)
- **Test run**: ✅ All passed | ❌ {N} failed (details)
```

If coverage was explicitly requested, append:

```
- **Coverage**: {line}% line, {branch}% branch
```

The `*Tests.cs` file itself should:

- Import `FluentAssertions`, `Moq`, `Xunit`
- Declare `Mock<T>` fields with `_camelCase` naming
- Store the object under test as a `_camelCase` private field, initialized in the constructor
- Group tests by method using `#region` blocks
- Cover every public method
- Use descriptive test names following the naming convention
- Follow AAA pattern in every test body

## Gotchas

- **Don't test private methods directly** — test them through the public API that calls them. If a private method is complex enough to need direct tests, it should probably be extracted into its own class.
- **Don't mock value objects** — records, DTOs, and simple data classes don't need mocking. Only mock interfaces for external dependencies.
- **No `It.IsAny<T>()`** — always use specific matchers. `It.Is<T>(x => x.Id == expected)` verifies the right data flows through. `It.IsAny<T>()` hides bugs by accepting anything. The only exception is `ILogger` verification where Moq forces `It.IsAny<>` on non-inspectable parameters.
- **`any` equivalent in C#** — never cast to `object` or use `dynamic` to bypass type safety in tests. Use `Mock<T>`, `Partial<T>`, or factory methods.
- **`_private` convention** — use `_camelCase` for private fields (mock declarations). This matches the project's field naming convention.
- **Natural naming** — store the object under test as a private field with a natural name (e.g., `_service`, `_handler`, `_validator`). Initialize it in the constructor from mock `.Object` references. Never use abstract names like `sut`.
- **Async tests** — always use `async Task` return type and `await` the call. Never use `.Result` or `.Wait()` in tests.
- **Timer-dependent code** — inject `IClock` or `TimeProvider` and mock it; don't depend on real `DateTime.Now`.
- **File naming** — always `{ClassName}Tests.cs`. The `Tests` suffix is the project convention.
- **No `IClassFixture` for unit tests** — reserve `IClassFixture<T>` and `ICollectionFixture<T>` for integration tests that need expensive shared resources. Unit tests should be fully isolated.
- **Avoid `dotnet sln add` in terminal** — it rewrites large sections of .sln files. Add project references manually only when explicitly required.
