# Naming — TypeScript

These supplement — not repeat — TypeScript's widely-known conventions (camelCase
functions, PascalCase types). Only non-obvious rules belong here.

- **Interfaces** — no `I` prefix. `UserProfile`, not `IUserProfile` — the `I`  prefix is a C# convention that doesn't belong in TypeScript.
- **Boolean variables** — use `is`, `has`, `can`, `should` prefixes: `isActive`, `hasPermission`, `canEdit`.
- **Event handlers** — prefix with `on` for the handler, `handle` for the  implementation: `onClick` (prop), `handleClick` (method).
- **Hooks** — `use` prefix only for actual React hooks: `useAuth`, `useCart`.
- **Enums** — PascalCase for the enum name, PascalCase for members:  `OrderStatus.Pending`, not `ORDER_STATUS.PENDING`.
