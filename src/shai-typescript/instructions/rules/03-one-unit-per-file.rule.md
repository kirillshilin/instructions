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
| Type definitions | `{name}.model.ts`   | `order.model.ts`        |

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
