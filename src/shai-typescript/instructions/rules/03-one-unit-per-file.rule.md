---
applyTo: "**/*.ts,**/*.tsx"
---

# One Unit per File

One primary unit per file — a class, component, service, or major function.

## Why

- **Discoverability** — `order.service.ts` tells you what's inside without opening it.
- **Git blame** — changes to one unit don't pollute another's history.
- **Tree-shaking** — bundlers work best with isolated exports.

## What counts as a unit

| Unit type        | File pattern        | Example                 |
| ---------------- | ------------------- | ----------------------- |
| Class with logic | `{name}.service.ts` | `order.service.ts`      |
| Component        | `{name}.tsx`        | `order-card.tsx`        |
| Hook             | `use-{name}.ts`     | `use-auth.ts`           |
| Large function   | `{name}.ts`         | `calculate-shipping.ts` |
| Type definitions | `{name}.types.ts`   | `order.types.ts`        |

## Exceptions

Co-locate when pieces are **small, uniform, and tightly coupled**:

- **Utility collections** — related pure functions sharing a domain
  (e.g. `date.utils.ts` with `formatDate`, `parseIso`, `daysBetween`).
- **Private type definitions** — types used only by one module can
  live in that module's file or a shared `{feature}.types.ts`.
- **Enum + related constants** — an enum and its lookup map or default
  value belong together.

## Avoid

- **Multiple classes in one file** — each class gets its own file.
- **Barrel files with logic** — `index.ts` should only re-export, never define.
- **"Helpers" grab bags** — group by domain: `string.utils.ts`, `date.utils.ts`.
