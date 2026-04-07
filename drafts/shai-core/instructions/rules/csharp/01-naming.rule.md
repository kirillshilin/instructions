---
applyTo: "**/*.cs"
---

# Naming — C#

These supplement — not repeat — .NET's established conventions (PascalCase
methods, PascalCase properties).

See [universal naming rules](../01-naming.rule.md) for the shared foundation.

- **Private fields** — `_camelCase`: `_repository`, `_logger`, `_connectionString`.
- **Interfaces** — `I` prefix is standard in .NET: `IUserRepository`,
  `IOrderService`. Follow the ecosystem here.
- **Async methods** — `Async` suffix: `GetUsersAsync`, `SaveOrderAsync`.
- **Boolean properties** — `Is`, `Has`, `Can` prefixes:
  `IsActive`, `HasPermission`, `CanEdit`.
