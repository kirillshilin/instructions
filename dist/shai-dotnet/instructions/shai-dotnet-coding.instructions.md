
# .NET / C# Coding Standards

Conventions for C# and .NET projects. Formatting and style are enforced by ReSharper and static code analysis — these rules cover architecture, structure, and patterns that tooling does not catch.


## Rules

### Naming Conventions — C#

- **Private fields** — `_camelCase`: `_repository`, `_logger`, `_connectionString`.
- **Interfaces** — `I` prefix is standard in .NET: `IUserRepository`,
  `IOrderService`. Follow the ecosystem here.
- **Async methods** — use the `Async` suffix: `GetUsersAsync`, `SaveOrderAsync`.
- **Boolean properties** — `Is`, `Has`, `Can` prefixes:
  `IsActive`, `HasPermission`, `CanEdit`.


### Folder Structure — C#

Keep folders **flat** and **semantically named**. Avoid deep nesting, but don't
dump everything into one directory either.

#### Principles

- **Flat over nested** — one level of semantic grouping is usually enough. If
  you need a subfolder inside a subfolder, reconsider the decomposition.
- **Semantic names** — folders describe *what kind* of thing lives inside:
  `Models`, `Services`, `Interfaces`, `Components`, `Extensions`, `Middleware`, `Exceptions`.
- **Feature folders when appropriate** — for larger apps, group by feature first,
  then by kind within. Keep the inner structure flat.
- **No unnecessary depth** — if a folder has only one child, it shouldn't exist.

#### Shared / Utility Folders

All `Extensions/`, and `Shared/` folders **must include a
`README.md`** indexing every export with a one-line description. Before adding a
new utility, read the README to check for existing equivalents.

#### .NET Projects

Follow the flat-semantic principle per project:

```
MyApp.Domain/
├── Models/
├── Services/
├── Interfaces/
└── Exceptions/
```

Split into separate projects (Domain, Application, Infrastructure) rather than
deep folder hierarchies within a single project. Maximum 2 levels of folders per project.


## Constants

Use `ALL_CAPS` for all `const` declarations to clearly distinguish immutable
values from mutable variables.

```csharp
public const int MAX_RETRIES = 3;
public const string API_BASE_URL = "/api/v1";
```
