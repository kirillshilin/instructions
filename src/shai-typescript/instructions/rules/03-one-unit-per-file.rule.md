### One Unit per Module

Keep one primary unit per file.

Do not combine an exported class or function with unrelated exports in the same
file.

#### Why

- **Discoverability** — `order.service.ts` tells you what is inside.
- **Git blame** — change history stays isolated.
- **Tree-shaking** — bundlers work best with isolated exports.
- **Cognitive load** — one purpose means less scanning.

#### What counts as a unit

| Unit type        | File pattern        | Example                 |
| ---------------- | ------------------- | ----------------------- |
| Class with logic | `{name}.service.ts` | `order.service.ts`      |
| Component        | `{name}.tsx`        | `order-card.tsx`        |
| Hook             | `use-{name}.ts`     | `use-auth.ts`           |
| Large function   | `{name}.ts`         | `calculate-shipping.ts` |
| Type definitions | `{name}.model.ts`   | `order.model.ts`        |

#### Utility functions

Utility functions are the main exception. Group related pure functions into one
file with this naming convention:

```
utilities/{group}.utilities.ts
```

| Domain     | File                                | Contents                                |
| ---------- | ----------------------------------- | --------------------------------------- |
| Dates      | `utilities/date.utilities.ts`       | `formatDate`, `parseIso`, `daysBetween` |
| Strings    | `utilities/string.utilities.ts`     | `slugify`, `truncate`, `capitalize`     |
| Validation | `utilities/validation.utilities.ts` | `isEmail`, `isUrl`, `isPositiveInt`     |

Each utility file should stay in one domain. If it grows beyond ~100 lines,
split it by subdomain.

#### Exceptions

Co-locate when pieces are **small, uniform, and tightly coupled**:

- **Private type definitions** — types used only by one module can
  live in that module's file or a shared `{feature}.types.ts`.
- **Enum + related constants** — an enum and its lookup map or default
  value belong together.

#### Avoid

- **Multiple exported classes in one file** — each class gets its own file.
- **Exported function + class in the same file** — even if related, separate them.
- **Barrel files with logic** — `index.ts` should only re-export, never define.
- **"Helpers" grab bags** — never create `helpers.ts` or `utils.ts` without a
  domain prefix.
