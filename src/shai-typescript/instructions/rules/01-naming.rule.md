---
id: T-I01-r01
priority: must
status: done
related: [T-I01]
---
### Naming — TypeScript

These supplement — not repeat — TypeScript's widely-known conventions (camelCase functions, PascalCase types). Only non-obvious rules belong here.

#### Length: prefer one meaningful word

- **Files** — pattern `{content}.{type}.{ext}`. The `{content}` part should be **one meaningful word**: `user.model.ts`, `order.service.ts`, `auth.guard.ts`. Use **two words only** when one is genuinely ambiguous: `order-status.model.ts` (not just `status.model.ts`). **Three or more words is a smell** — it usually means the file is doing too much, or the type suffix is missing.
- **Variables, parameters, properties** — same rule. Prefer `user` over `currentUser`, `order` over `incomingOrder`, `count` over `totalItemCount`. Add a qualifier only when scope demands it (`previousUser` next to `user`, `rawInput` next to `input`).
- **Classes, types, interfaces** — one PascalCase word ideally (`User`, `Order`, `Cart`). Two words when the domain noun is compound (`OrderStatus`, `PaymentMethod`). Avoid `UserProfileDataManager`-style stacks — split the unit instead.
- **Functions** — `verb` or `verbNoun`: `save`, `loadUser`, `calculateTotal`. Three words is rare and usually means the function does two things.

If a name needs three words, ask: is this unit too broad? Is the type suffix carrying redundant context? Can the surrounding folder name remove a word?

#### Other rules

- **Interfaces** — no `I` prefix. `UserProfile`, not `IUserProfile` — the `I` prefix is a C# convention that doesn't belong in TypeScript.
- **Boolean variables** — use `is`, `has`, `can`, `should` prefixes: `isActive`, `hasPermission`, `canEdit`.
- **Event handlers** — prefix with `on` for the handler, `handle` for the implementation: `onClick` (prop), `handleClick` (method).
- **Hooks** — `use` prefix only for actual React hooks: `useAuth`, `useCart`.
- **Enums** — PascalCase for the enum name, PascalCase for members: `OrderStatus.Pending`, not `ORDER_STATUS.PENDING`.
