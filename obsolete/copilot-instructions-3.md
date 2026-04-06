# Copilot Master Instructions

## Codebase Documentation

Detailed documentation for this codebase is in the `docs/` folder. **Always consult these before analyzing source files from scratch:**

| File | Topics Covered |
|---|---|
| [`docs/01-entity-model.md`](../docs/01-entity-model.md) | Entity, Attribute, DataType, AttributeRole, EntityModel, NamingConvention, SystemMetadata, Data Policies (Lookup/Money/Multilookup expansion) |
| [`docs/02-entity-features.md`](../docs/02-entity-features.md) | EntityFeatures, concept flow (entity→DB→dynamic→EF), ModelRestorer, feature enrichers (Tracking, SoftDeletion, Enum), ClassFactory, DbContextBase |
| [`docs/03-relational-mapping.md`](../docs/03-relational-mapping.md) | RelationalStorageMapper, DbModel, EntityTableGroup, table types (Base/Translations/View), constraints, naming conventions, TPT inheritance, self-lookups |
| [`docs/04-sql-expression-trees.md`](../docs/04-sql-expression-trees.md) | SqlExpression hierarchy, ViewBuilder, all composer classes (RootViewComposer, LookupAttributeViewComposer, etc.), StorageExpressionBuilder, SqlTranslatingVisitor |
| [`docs/05-testing-reference.md`](../docs/05-testing-reference.md) | RelationalStorageMapperTests and StorageExpressionBuilderTests — all test cases, test data format, SQL output examples, test infrastructure |
| [`docs/06-quick-reference.md`](../docs/06-quick-reference.md) | **Start here** — key class reference table, data type/SQL mapping, naming rules, feature summary, composer order, primary attribute concept |



- For all variables that represent expression nodes (for example: `Expression`, `MethodCallExpression`, `BinaryExpression`), use explicit names prefixed with `e` (for example: `eSource`, `eProperty`, `eSkip`, `eTake`).
- For private fields, use the `_name` naming convention.
- Prefer single-word variable names where possible; use longer names only when required for clarity, disambiguation, or existing conventions.
- For each non-trivial expression node creation, add a comment immediately above it showing the equivalent code that expression represents (for example: `// source.Value`).
- Do not inline or nest non-trivial expression constructions.
- Create each non-trivial expression node on a separate line.
- Simple expression nodes such as `Expression.Constant(...)` and `Expression.Convert(...)` may stay concise.
- Avoid static classes unless necessary. Prefer instance classes and dependency injection.
- Avoid manually instantiating service classes with `new` in production code. Prefer constructor injection and let the DI container resolve dependencies. In tests, wiring up dependencies explicitly with `new` is acceptable and preferred.

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

# Class Organization

- Large classes should be split into separate partial files, grouped logically.
- Use the `partial` keyword to split a class across multiple files.
- Group related functionality together (e.g., properties, methods, events).
- Each partial file should have a clear purpose or logical grouping.

# Generic Class File Naming

- Classes that have both generic and non-generic versions MUST be split into separate files.
- Non-generic version: Use the class name as-is (e.g., `Class.cs`).
- Generic version: Append a single backtick character (`) to the class name before the `.cs` extension.
- Example:
  - `Result.cs` - Contains the non-generic `Result` class
  - `Result`.cs`- Contains the generic`Result<T>` class
  - Note: The actual filename is literally "Result` followed by .cs" - the backtick is part of the filename

# Nested Classes and Private Classes

- Private comparers or private nested classes MUST go into dot-separated files.
- Parent class: `Parent.cs`
- Nested/inner class: `Parent.Child.cs`
- Example:
  - `UserService.cs` - Contains the main `UserService` class
  - `UserService.UserComparer.cs` - Contains the private `UserComparer` nested class
- This applies to:
  - Private comparers (e.g., `IEqualityComparer<T>`, `IComparer<T>`)
  - Private nested classes
  - Private helper classes specific to the parent class

# File Organization

- Keep related partial files together in the same folder.
- Use consistent naming conventions for partial files.
- Consider naming partial files with descriptive suffixes when helpful (e.g., `MyClass.Properties.cs`, `MyClass.Methods.cs`).

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

# Test Folder Structure

- Test folder structure MUST mimic the folder structure in the main project.
- Example: If main project has `Services/UserService.cs`, test project should have `Services/UserServiceTests.cs`.
- Maintain the same namespace hierarchy between main and test projects.

# Test Structure

- Use Arrange-Act-Assert (AAA) pattern.
- Keep tests focused and single-purpose.
- Use meaningful variable names.
- Add comments to clarify complex setup or assertions.

# Scaffold Command

When the user says **scaffold** (e.g., "scaffold this class", "scaffold tests"):

- Generate only the basic structure — class/interface skeleton, constructor, method stubs, property declarations.
- Do **not** implement method bodies beyond `throw new NotImplementedException()` or a minimal placeholder.
- For **scaffold tests**: include exactly **one** representative test method stub; do not generate a full test suite.
- Do **not** run tests, build the project, or start the application after scaffolding.
- Do **not** ask for confirmation before scaffolding — proceed immediately.
