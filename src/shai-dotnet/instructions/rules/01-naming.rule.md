### Naming Conventions — C#

- **Private fields** — `_camelCase`: `_repository`, `_logger`, `_connectionString`.
- **Interfaces** — `I` prefix is standard in .NET: `IUserRepository`,
  `IOrderService`. Follow the ecosystem here.
- **Async methods** — use the `Async` suffix: `GetUsersAsync`, `SaveOrderAsync`.
- **Boolean properties** — `Is`, `Has`, `Can` prefixes:
  `IsActive`, `HasPermission`, `CanEdit`.
