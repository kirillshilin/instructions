# Test Data Guide

Patterns for creating and managing test data in C# xUnit tests: builders,
`TheoryData<T>`, and JSON resource files. Loaded by the
[shai-unit-testing-dotnet](../SKILL.md) skill when tests need non-trivial
test data.

---

## Decision Tree: How to Supply Test Data

```
How complex is the test data?
├── Primitive values (int, string, bool)
│   └── [InlineData] — inline in the attribute
├── Simple objects, 2–5 cases
│   └── [MemberData] with TheoryData<T>
├── Complex objects, many properties
│   └── Test Data Builder → feed into TheoryData<T> or direct use
├── Large / declarative data sets (10+ cases)
│   └── JSON resource file → [MemberData] loader
└── Shared across test classes
    └── [ClassData] or shared static class
```

---

## 1. TheoryData<T> (Preferred for MemberData)

Use `TheoryData<T1, T2, ...>` instead of `IEnumerable<object[]>` — it's
type-safe and the compiler catches mismatches:

```csharp
public static TheoryData<string, int, bool> ValidationCases => new()
{
    { "valid email",   200, true },
    { "missing @",     400, false },
    { "empty string",  400, false },
};

[Theory]
[MemberData(nameof(ValidationCases))]
public void Should_Validate_ReturnExpected_WhenGivenInput(
    string caseName, int statusCode, bool expected)
{
    // ...
}
```

**Rules:**
- Always include a `caseName` (string) as the first parameter so test failure
  messages identify which case failed
- Use `=>` property syntax (not a method) for simple static data
- Use a static method when data needs computation or loading

---

## 2. Test Data Builders

Use the Builder pattern when objects have many properties and tests need
only specific variations:

```csharp
public class UserBuilder
{
    private string _name = "John Doe";
    private string _email = "john@example.com";
    private bool _isActive = true;
    private UserRole _role = UserRole.Member;

    public UserBuilder WithName(string name) { _name = name; return this; }
    public UserBuilder WithEmail(string email) { _email = email; return this; }
    public UserBuilder WithRole(UserRole role) { _role = role; return this; }
    public UserBuilder Inactive() { _isActive = false; return this; }

    public User Build() => new(_name, _email, _isActive, _role);
}
```

**Usage in tests:**

```csharp
[Fact]
public void Should_Deactivate_SetInactive_WhenUserIsActive()
{
    // Arrange
    var user = new UserBuilder().WithName("Alice").Build();

    // Act
    var actual = _service.Deactivate(user);

    // Assert
    actual.IsActive.Should().BeFalse();
}

[Fact]
public void Should_Deactivate_ThrowException_WhenUserAlreadyInactive()
{
    // Arrange
    var user = new UserBuilder().Inactive().Build();

    // Act
    var act = () => _service.Deactivate(user);

    // Assert
    act.Should().ThrowExactly<InvalidOperationException>();
}
```

**When to use builders:**
- Object has >3 properties
- Multiple tests need the same object with small variations
- Object construction is non-trivial (validation, computed fields)

**When NOT to use builders:**
- Object has 1–2 properties — just construct inline
- Object is a simple record/DTO with no invariants

**Builder location:** Place builders in a shared `TestData/` or `Builders/`
folder within the test project:
```
tests/
├── Builders/
│   ├── UserBuilder.cs
│   └── OrderBuilder.cs
├── Services/
│   └── UserServiceTests.cs
```

---

## 3. JSON Resource Files

For large declarative test data sets, store cases in JSON files and load them
in `[MemberData]`:

### File structure

```
tests/
├── TestData/
│   ├── validation-cases.json
│   └── pricing-rules.json
├── Services/
│   └── ValidationServiceTests.cs
```

### JSON format

```json
[
  {
    "name": "valid email",
    "input": { "email": "user@example.com", "age": 25 },
    "expectedValid": true
  },
  {
    "name": "missing @ symbol",
    "input": { "email": "userexample.com", "age": 25 },
    "expectedValid": false
  },
  {
    "name": "underage user",
    "input": { "email": "user@example.com", "age": 12 },
    "expectedValid": false
  }
]
```

### Test case model

```csharp
public record ValidationTestCase(
    string Name,
    ValidationInput Input,
    bool ExpectedValid);

public record ValidationInput(
    string Email,
    int Age);
```

### Loading in MemberData

```csharp
public static TheoryData<string, ValidationInput, bool> LoadValidationCases()
{
    var json = File.ReadAllText("TestData/validation-cases.json");
    var cases = JsonSerializer.Deserialize<List<ValidationTestCase>>(json,
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

    var data = new TheoryData<string, ValidationInput, bool>();
    foreach (var c in cases)
        data.Add(c.Name, c.Input, c.ExpectedValid);

    return data;
}

[Theory]
[MemberData(nameof(LoadValidationCases))]
public void Should_Validate_ReturnExpected_WhenGivenTestCase(
    string caseName, ValidationInput input, bool expectedValid)
{
    // Act
    var actual = _validator.Validate(input);

    // Assert
    actual.IsValid.Should().Be(expectedValid, because: caseName);
}
```

### .csproj configuration

Make sure JSON files are copied to the output directory:

```xml
<ItemGroup>
  <None Update="TestData\**\*.json">
    <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
  </None>
</ItemGroup>
```

**When to use JSON resources:**
- 10+ test cases with the same structure
- Test data is business-rule-driven (non-developers might maintain it)
- Cases are verbose and clutter the code when inline
- Same data set is shared across multiple test classes

**When NOT to use:**
- <5 cases — use `TheoryData<T>` directly
- Data is tightly coupled to one test method — keep it inline

---

## 4. Anti-Patterns

| Anti-pattern                              | Why it's bad                                 | Do instead                              |
| ----------------------------------------- | -------------------------------------------- | --------------------------------------- |
| `new object[] { ... }` for MemberData     | No type safety, runtime errors on mismatch   | Use `TheoryData<T1, T2>`                |
| Massive inline builders in test body      | Test body becomes unreadable                 | Extract to a Builder class              |
| Shared mutable test data                  | Tests become order-dependent                 | Build fresh data per test               |
| Magic numbers / strings without context   | Hard to understand what the value represents | Use named constants or builder methods  |
| JSON files with environment-specific data | Tests fail on other machines                 | Use relative paths, self-contained data |
