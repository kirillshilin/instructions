---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Coding Standards

TypeScript conventions for architecture, structure, and patterns not covered by ESLint or the compiler.


## Rules

# Naming — TypeScript

These supplement — not repeat — TypeScript's widely-known conventions (camelCase
functions, PascalCase types). Only non-obvious rules belong here.

See [universal naming rules](../01-naming.rule.md) for the shared foundation.

- **Interfaces** — no `I` prefix. `UserProfile`, not `IUserProfile` — the `I`
  prefix is a C# convention that doesn't belong in TypeScript.
- **Boolean variables** — use `is`, `has`, `can`, `should` prefixes:
  `isActive`, `hasPermission`, `canEdit`.
- **Event handlers** — prefix with `on` for the handler, `handle` for the
  implementation: `onClick` (prop), `handleClick` (method).
- **Hooks** — `use` prefix only for actual React hooks: `useAuth`, `useCart`.
- **Enums** — PascalCase for the enum name, PascalCase for members:
  `OrderStatus.Pending`, not `ORDER_STATUS.PENDING`.


# Folder Structure — TypeScript

Keep folders **flat** and **semantically named**. Avoid deep nesting, but don't
dump everything into one directory either.

## Principles

- **Flat over nested** — one level of semantic grouping is usually enough. If
  you need a subfolder inside a subfolder, reconsider the decomposition.
- **Semantic names** — folders describe *what kind* of thing lives inside:
  `models`, `services`, `hooks`, `components`, `utilities`, `middleware`, `guards`.
- **Feature folders when appropriate** — for larger apps, group by feature first,
  then by kind within. Keep the inner structure flat.
- **No unnecessary depth** — if a folder has only one child, it shouldn't exist.

## Shared / Utility Folders

All `utilities/` and `shared/` folders **must include a
`README.md`** indexing every export with a one-line description. Before adding a
new utility, read the README to check for existing equivalents.

Utility files follow the naming convention `utilities/{group}.utilities.ts`
(e.g. `utilities/date.utilities.ts`, `utilities/string.utilities.ts`). See the
one-unit-per-module rule for details.

## TypeScript / Frontend Projects

**Small project:**
```
src/
├── components/
├── hooks/
├── models/
├── services/
└── utilities/
```

**Larger project (feature-based):**
```
src/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── models/
│   └── services/
├── orders/
│   ├── components/
│   ├── models/
│   └── services/
└── shared/
    ├── components/
    ├── hooks/
    └── utilities/
```

**Avoid:**
```
src/
├── components/
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── buttons/
│   │   │   │   └── primary/
```
Why: deep nesting makes imports painful and files hard to locate. If a folder
has only one child, it shouldn't exist.


# One Unit per Module

One primary unit per file — a class, component, service, or major function.
This is **critical** and non-negotiable: never combine an exported function or
class with other functions in the same file.

## Why

- **Discoverability** — `order.service.ts` tells you what's inside without opening it.
- **Git blame** — changes to one unit don't pollute another's history.
- **Tree-shaking** — bundlers work best with isolated exports.
- **Cognitive load** — a file with one purpose requires no scanning to understand.

## What counts as a unit

| Unit type        | File pattern        | Example                 |
| ---------------- | ------------------- | ----------------------- |
| Class with logic | `{name}.service.ts` | `order.service.ts`      |
| Component        | `{name}.tsx`        | `order-card.tsx`        |
| Hook             | `use-{name}.ts`     | `use-auth.ts`           |
| Large function   | `{name}.ts`         | `calculate-shipping.ts` |
| Type definitions | `{name}.types.ts`   | `order.types.ts`        |

## Utility functions

Utility functions are the one exception to one-function-per-file — logically
group related pure functions into a single file using the naming convention:

```
utilities/{group}.utilities.ts
```

| Domain     | File                                | Contents                                |
| ---------- | ----------------------------------- | --------------------------------------- |
| Dates      | `utilities/date.utilities.ts`       | `formatDate`, `parseIso`, `daysBetween` |
| Strings    | `utilities/string.utilities.ts`     | `slugify`, `truncate`, `capitalize`     |
| Validation | `utilities/validation.utilities.ts` | `isEmail`, `isUrl`, `isPositiveInt`     |

Each utility file groups functions that share a **single domain**. If a utility
file grows beyond ~100 lines, split it by subdomain.

## Exceptions

Co-locate when pieces are **small, uniform, and tightly coupled**:

- **Private type definitions** — types used only by one module can
  live in that module's file or a shared `{feature}.types.ts`.
- **Enum + related constants** — an enum and its lookup map or default
  value belong together.

## Avoid

- **Multiple exported classes in one file** — each class gets its own file.
- **Exported function + class in the same file** — even if related, separate them.
- **Barrel files with logic** — `index.ts` should only re-export, never define.
- **"Helpers" grab bags** — never create `helpers.ts` or `utils.ts` without a domain prefix.


## Constants

Use `ALL_CAPS` for all `const` declarations to clearly distinguish immutable
values from mutable variables.

```typescript
const MAX_RETRIES = 3;
const API_BASE_URL = "/api/v1";
const DEFAULT_TIMEOUT = 5000;
```
