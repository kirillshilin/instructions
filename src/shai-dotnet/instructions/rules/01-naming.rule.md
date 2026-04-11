---
applyTo: "**/*.cs"
---

# Naming Conventions — C#

- **Private fields** — `_camelCase`: `_repository`, `_logger`, `_connectionString`.
- **Interfaces** — `I` prefix is standard in .NET: `IUserRepository`,
  `IOrderService`. Follow the ecosystem here.
- **Async methods** — `Async` suffix: `GetUsersAsync`, `SaveOrderAsync` only if there non async methods at the class
- **Boolean properties** — `Is`, `Has`, `Can` prefixes:
  `IsActive`, `HasPermission`, `CanEdit`.
