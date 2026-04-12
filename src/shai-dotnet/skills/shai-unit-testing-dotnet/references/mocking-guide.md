# Mocking Guide

Patterns and strategies for mocking dependencies in C# xUnit tests using Moq.
Loaded by the [shai-unit-testing-dotnet](../SKILL.md) skill when tests require
dependency isolation.

---

## Mocking Strategy Decision Tree

```
Need to mock a dependency?
├── Is it YOUR code (interface you own)?
│   ├── Simple interface → Mock<IService> field
│   └── Complex class → Mock<T> with CallBase for partial mock
├── Is it a third-party service?
│   ├── Has an interface → Mock the interface
│   └── No interface → Wrap in an adapter, mock the adapter
└── Is it a static/global (DateTime, HttpClient)?
    ├── DateTime → Inject IClock / TimeProvider, mock it
    └── HttpClient → Use MockHttpMessageHandler or wrap in adapter
```

---

## 1. Field-Level Mocks (Preferred)

Best for interfaces and abstractions you own:

```csharp
public class OrderServiceTests
{
    private readonly Mock<IOrderRepository> _repo = new();
    private readonly Mock<IPaymentGateway> _payment = new();
    private readonly Mock<ILogger<OrderService>> _logger = new();

    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _service = new(
            _repo.Object,
            _payment.Object,
            _logger.Object);
    }
}
```

**Why field-level mocks are preferred:**
- xUnit creates a new instance per test — mocks are automatically fresh
- No need for `[SetUp]`, `BeforeEach`, or manual `Reset()`
- Type-safe — `Mock<T>` enforces the interface contract at compile time
- Centralized construction in the constructor — only one place to update
  when dependencies change

**Naming rule:** Mock fields use `_camelCase` (private field convention).
The variable references the mock's concept, not the mock wrapper:
```csharp
// ✅ Good
private readonly Mock<IOrderRepository> _repo = new();
private readonly Mock<IClock> _clock = new();

// ❌ Bad
private readonly Mock<IOrderRepository> _mockRepo = new();  // redundant "mock" prefix
private readonly Mock<IClock> clockMock = new();             // missing underscore prefix
```

---

## 2. Setup Patterns

### Return values

```csharp
// Single return
_repo.Setup(r => r.FindByIdAsync(userId, default))
     .ReturnsAsync(expectedUser);

// Conditional return
_repo.Setup(r => r.FindByIdAsync(It.Is<Guid>(id => id == knownId), default))
     .ReturnsAsync(expectedUser);

// Sequence (different returns per call)
_repo.SetupSequence(r => r.GetNextAsync(default))
     .ReturnsAsync(firstItem)
     .ReturnsAsync(secondItem)
     .ThrowsAsync(new InvalidOperationException("empty"));
```

### Callback / side effects

```csharp
Order? captured = null;
var expectedId = Guid.NewGuid();
_repo.Setup(r => r.SaveAsync(It.Is<Order>(o => o.CustomerId == customerId), default))
     .Callback<Order, CancellationToken>((order, _) => captured = order)
     .ReturnsAsync(expectedId);
```

### Throwing exceptions

```csharp
var unknownId = Guid.NewGuid();
_repo.Setup(r => r.FindByIdAsync(unknownId, default))
     .ThrowsAsync(new TimeoutException("DB timeout"));
```

---

## 3. Verification Patterns

Verify that a dependency was called with the right arguments:

```csharp
// Called exactly once
_repo.Verify(r => r.SaveAsync(
    It.Is<Order>(o => o.CustomerId == customerId),
    default), Times.Once);

// Never called (It.IsAny is acceptable here — asserting no call at all)
_repo.Verify(r => r.DeleteAsync(It.IsAny<Guid>(), default), Times.Never);

// Called N times
_logger.Verify(
    l => l.Log(
        LogLevel.Warning,
        It.IsAny<EventId>(),
        It.IsAny<It.IsAnyType>(),
        It.IsAny<Exception>(),
        It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
    Times.Exactly(2));
```

**Prefer specific matchers — avoid `It.IsAny<T>()`:**
```csharp
// ✅ Verifies the right user was saved
_repo.Verify(r => r.SaveAsync(
    It.Is<User>(u => u.Email == "test@example.com" && u.IsActive),
    default), Times.Once);

// ❌ Verifies *something* was saved — too broad
_repo.Verify(r => r.SaveAsync(It.IsAny<User>(), default), Times.Once);
```

---

## 4. MockBehavior: Strict vs Loose

| Behavior               | When to use                                          |
| ---------------------- | ---------------------------------------------------- |
| `MockBehavior.Default` | Default. Methods return default values if not set up |
| `MockBehavior.Strict`  | When you need to verify NO unexpected calls are made |

```csharp
// Strict — throws on any unexpected call
private readonly Mock<IPaymentGateway> _payment = new(MockBehavior.Strict);
```

**Guidance:** Default to loose mocks. Use strict only when the "no unexpected
calls" guarantee is part of the test's assertion — e.g., verifying that a
specific method is NOT called.

---

## 5. Special Mock Scenarios

### Mocking `ILogger<T>`

```csharp
private readonly Mock<ILogger<OrderService>> _logger = new();

// Verify a log call was made (specific level)
_logger.Verify(
    l => l.Log(
        LogLevel.Error,
        It.IsAny<EventId>(),
        It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("failed")),
        It.IsAny<Exception>(),
        It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
    Times.Once);
```

### Mocking `HttpClient`

Don't mock `HttpClient` directly — mock the `HttpMessageHandler`:

```csharp
var handler = new Mock<HttpMessageHandler>();
handler.Protected()
       .Setup<Task<HttpResponseMessage>>(
           "SendAsync",
           ItExpr.IsAny<HttpRequestMessage>(),
           ItExpr.IsAny<CancellationToken>())
       .ReturnsAsync(new HttpResponseMessage(HttpStatusCode.OK)
       {
           Content = new StringContent(JsonSerializer.Serialize(expected))
       });

var client = new HttpClient(handler.Object) { BaseAddress = new Uri("https://api.example.com") };
```

### Mocking `TimeProvider` / `IClock`

```csharp
private readonly Mock<TimeProvider> _time = new();
private readonly ExpirationChecker _checker;

public ExpirationCheckerTests()
{
    _checker = new(_time.Object);
}

// In each test's Arrange section, configure mock behavior:
_time.Setup(t => t.GetUtcNow()).Returns(new DateTimeOffset(2025, 1, 15, 0, 0, 0, TimeSpan.Zero));
```

---

## 6. Anti-Patterns

| Anti-pattern                       | Why it's bad                                    | Do instead                                           |
| ---------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |
| Mocking the class under test       | Tests the mock, not the real code               | Only mock dependencies                               |
| Mocking value objects / DTOs       | No behavior to mock, adds noise                 | Use real instances                                   |
| `It.IsAny<T>()` in setups/verifies | Tests don't verify the right data flows through | Use `It.Is<T>(predicate)` or pass the exact variable |
| `.Returns(() => new List<T>())`    | Hard to read for simple cases                   | Use `.Returns(new List<T>())` directly               |
| Verifying every mock call          | Tests become brittle — break on any refactor    | Verify only calls that ARE the behavior              |
| `Mock.Of<T>()` for complex setups  | Hard to read and verify                         | Use `new Mock<T>()` with explicit setups             |
