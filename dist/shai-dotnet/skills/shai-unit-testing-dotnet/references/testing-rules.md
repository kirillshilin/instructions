# Testing Rules Reference

Comprehensive rules for writing C# unit tests with xUnit, Moq, and
FluentAssertions. Loaded by the
[shai-unit-testing-dotnet](../SKILL.md) skill when writing or reviewing tests.

---

## 1. Coverage Requirements

**Non-negotiable rule:** Every public method of every public class MUST have
at least one test.

| Construct                            | Required Tests                                    |
| ------------------------------------ | ------------------------------------------------- |
| Public class — public method         | ≥1 test per method (happy path minimum)           |
| Internal method (InternalsVisibleTo) | ≥1 test if exposed for testing                    |
| Private/protected methods            | NOT tested directly — covered via public API      |
| Property with logic                  | Test if property getter/setter contains branching |
| Trivial auto-properties              | Skip — no logic to test                           |
| Static methods                       | Test like any public method                       |

**Target test count per method:**
- Simple method (1 code path): 1–2 tests
- Method with branching (if/else, switch): 1 test per branch minimum
- Method with error handling: 1 happy + 1 error per distinct exception type
- Method with nullable params: add null edge case
- Guard clauses: 1 test per guard

---

## 2. Test Structure — AAA Pattern

Every test body follows Arrange-Act-Assert with visible section separation:

```csharp
[Fact]
public void Should_CalculateTotal_ReturnSumWithTax_WhenItemsProvided()
{
    // Arrange
    var items = new[] { new Item(100m), new Item(200m) };
    var taxRate = 0.1m;
    var expected = 330m;

    // Act
    var actual = _service.CalculateTotal(items, taxRate);

    // Assert
    actual.Should().Be(expected);
}
```

**Rules:**
- Always include `// Arrange`, `// Act`, `// Assert` comments
- Blank line between each section
- `// Arrange` may be omitted when there is no setup (rare)
- Extract method parameters into named variables in Arrange — never inline
  `new` expressions or literals directly in the Act call
- Name the Act result `actual` and the Arrange expectation `expected` where
  the test compares a return value against a known-good value
- Always keep `// Act` and `// Assert` as separate sections — never combine
  them:
  ```csharp
  [Fact]
  public void Should_Process_ThrowArgumentNullException_WhenInputIsNull()
  {
      // Arrange
      string input = null!;

      // Act
      var act = () => _service.Process(input);

      // Assert
      act.Should().ThrowExactly<ArgumentNullException>();
  }
  ```

---

## 3. Test Naming Convention

Format: `Should_{Method}_{ExpectedBehavior}_When{Condition}`

```csharp
// ✅ Good
Should_FindById_ReturnUser_WhenIdExists
Should_FindById_ReturnNull_WhenIdDoesNotExist
Should_Create_ThrowValidationException_WhenEmailIsInvalid
Should_ProcessPayment_CallAuditLog_WhenAmountExceedsThreshold

// ❌ Bad
TestGetUserById            // no expected behavior, no condition
WorksCorrectly             // meaningless
ReturnsData                // too vague
PlaceOrder_Valid_Success   // doesn't follow Should_ convention
```

**Guidelines:**
- Start with `Should_` — reads as a specification
- Include the method name being tested right after `Should_`
- Include the condition that triggers the behavior (`When...`)
- Name the specific error type, return value, or side effect
- Use PascalCase throughout (C# convention)

---

## 4. Region Block Organization

```csharp
public class OrderServiceTests
{
    // Field-level mocks + constructor at the top

    #region PlaceOrder

    [Fact]
    public void Should_PlaceOrder_ReturnOrderId_WhenValid() { ... }

    [Fact]
    public void Should_PlaceOrder_ThrowException_WhenCartIsEmpty() { ... }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Should_PlaceOrder_ThrowException_WhenQuantityIsInvalid(int qty) { ... }

    #endregion

    #region CancelOrder

    [Fact]
    public void Should_CancelOrder_SetStatusCancelled_WhenOrderExists() { ... }

    #endregion
}
```

**Rules:**
- One `#region` per method under test
- Region name = method name (exact match)
- `[Fact]` and `[Theory]` tests for the same method go in the same region
- Order regions by the method declaration order in the source class
- No nested regions

---

## 5. Test Class Setup

**Preferred pattern: field-level mocks + constructor initialization**

```csharp
public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _repo = new();
    private readonly Mock<IClock> _clock = new();
    private readonly Mock<ILogger<OrderService>> _logger = new();

    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _service = new(_repo.Object, _clock.Object, _logger.Object);
    }
}
```

**Why this pattern:**
- xUnit creates a new instance per test, so mock fields are automatically fresh
- No need for `[SetUp]` or manual reset
- Constructor centralizes construction — if the constructor changes,
  update one place
- The Act line stays clean: `_service.Method(param)` — all data is in Arrange
- Mock fields use `_camelCase` prefix (project convention)

**When NOT to use constructor initialization:**
- When a specific test needs a different constructor overload — construct
  inline in that test
- When testing static methods (no instance to create)
- In these cases, construct inline in the test body

---

## 6. FluentAssertions Patterns

Prefer FluentAssertions over raw `Assert.*` for readability:

```csharp
// Value equality
result.Should().Be(42);
result.Should().NotBeNull();

// Object comparison (all properties)
user.Should().BeEquivalentTo(expectedUser);

// Collection assertions
items.Should().HaveCount(3);
items.Should().Contain(x => x.Name == "Widget");
items.Should().BeInAscendingOrder(x => x.Price);
items.Should().OnlyContain(x => x.IsActive);

// String assertions
name.Should().StartWith("John");
email.Should().Contain("@");

// Exception assertions
act.Should().ThrowExactly<ArgumentException>()
   .WithMessage("*invalid*");

// Async exception assertions
await act.Should().ThrowAsync<HttpRequestException>()
         .WithMessage("Network error");

// Type assertions
result.Should().BeOfType<OrderConfirmation>();
result.Should().BeAssignableTo<IResult>();
```

**Rules:**
- Use `.Should().BeEquivalentTo()` for complex object comparison — avoids
  writing one assertion per property
- Use `.ThrowExactly<T>()` over `.Throw<T>()` when the exact exception type
  matters
- Avoid `Assert.True(condition)` — use `condition.Should().BeTrue()` or a
  more specific assertion

---

## 7. Theory / Data-Driven Test Rules

- Use `[Theory]` + `[InlineData]` for 2–5 simple parameterised cases
- Use `[MemberData]` with `TheoryData<T>` for complex objects or >5 cases
- Use `[ClassData]` rarely — only when test data is shared across multiple
  test classes
- Always include a `caseName` parameter for `[MemberData]` tests so failure
  messages identify which case failed
- For large declarative data sets, load from JSON resource files
  (see [test-data-guide.md](test-data-guide.md))

```csharp
// Avoid: too many InlineData attributes
[Theory]
[InlineData(1)] [InlineData(2)] [InlineData(3)]
[InlineData(4)] [InlineData(5)] [InlineData(6)]  // → switch to MemberData

// Prefer: TheoryData for complex cases
public static TheoryData<string, Order, bool> OrderCases => new()
{
    { "valid order",   new Order("A", 1, 10m), true },
    { "zero quantity", new Order("B", 0, 10m), false },
};
```
