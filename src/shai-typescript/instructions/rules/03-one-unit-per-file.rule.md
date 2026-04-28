---
id: T-I01-r03
priority: must
status: done
related: [T-I01]
---
### One Unit per Module

**Mandatory.** Every file holds exactly one primary exported unit. Pick the file pattern from the table below **before creating the file** — the suffix is the contract that tells readers (and the agent) what lives inside.

Do not combine an exported class or function with unrelated exports in the same file.

#### Why

- **Discoverability** — `order.service.ts` tells you what is inside.
- **Git blame** — change history stays isolated.
- **Tree-shaking** — bundlers work best with isolated exports.
- **Cognitive load** — one purpose means less scanning.

#### Filename matches the unit name

The filename follows the pattern **`{content}.{type}.{ext}`** — e.g. `user.model.ts`, `order.service.ts`. The `{content}` part is the **kebab-case form of the exported symbol** with the type-suffix stripped.

**Prefer one word for `{content}`.** Use two words only when one is genuinely ambiguous (`order-status.model.ts` — `status.model.ts` would be too generic). Three or more words is a smell — split the unit, or rely on the folder name to carry context (`orders/status.model.ts` instead of `order-status.model.ts` if a domain folder exists).

Rules:

- Strip the trailing role word (`Service`, `Command`, `Options`, `Builder`, `Component`, `Model`, `Schema`) from the symbol; the suffix lives in the file extension instead. `OrderService` → `order.service.ts`, not `order-service.service.ts`.
- Do **not** strip a role word that is part of the domain. `OrderStatus` is not a "Status" unit — it's a model named `OrderStatus`, so `order-status.model.ts`.
- One symbol, one filename — renaming the class renames the file.

#### Routing: unit type → folder → filename

This is the lookup table to consult **before creating any new `.ts` file**. The folder and the filename suffix together encode what's inside. Ask the questions top-to-bottom and stop at the first match.

| Unit type            | Folder        | File pattern                   | Symbol example           | File example                           |
| -------------------- | ------------- | ------------------------------ | ------------------------ | -------------------------------------- |
| Zod schema           | `schemas/`    | `{name}.schema.ts`             | `UserSchema`             | `schemas/user.schema.ts`               |
| Type / interface     | `models/`     | `{name}.model.ts`              | `User`                   | `models/user.model.ts`                 |
| Enum                 | `models/`     | `{name}.model.ts`              | `OrderStatus`            | `models/order-status.model.ts`         |
| Component            | `components/` | `{name}.component.ts` / `.tsx` | `OrderCardComponent`     | `components/order-card.component.ts`   |
| Class with logic     | `services/`   | `{name}.service.ts`            | `OrderService`           | `services/order.service.ts`            |
| CLI command (yargs)  | `commands/`   | `{name}.command.ts`            | `GenerateCommand`        | `commands/generate.command.ts`         |
| CLI options (yargs)  | `commands/`   | `{name}.options.ts`            | `GenerateCommandOptions` | `commands/generate-command.options.ts` |
| Builder              | (beside use)  | `{name}.builder.ts`            | `SomethingBuilder`       | `something.builder.ts`                 |
| React hook           | `hooks/`      | `use-{name}.ts`                | `useAuth`                | `hooks/use-auth.ts`                    |
| Function module      | (by domain)   | `{name}.fn.ts`                 | `onCalculateShipping`    | `pricing/calculate-shipping.fn.ts`     |
| Firebase function    | `src/fn/`     | `{name}.fn.ts`                 | `onUserCreated`          | `src/fn/on-user-created.fn.ts`         |
| Utility group (pure) | `utilities/`  | `{group}.utilities.ts`         | `formatDate`, `parseIso` | `utilities/date.utilities.ts`          |

If none fit, the unit probably needs splitting — not a new generic file.

For Firebase function file structure, see [shai-firebase-functions](../../../shai-firebase/instructions/shai-firebase-functions.instructions.md). For yargs CLI commands, see `shai-yargs-command`. For Zod schemas, see `shai-zod-schema`.

#### Utility functions

Utility functions are the main exception to one-symbol-per-file. Group related pure functions into one file: `utilities/{group}.utilities.ts`.

- `utilities/date.utilities.ts` — `formatDate`, `parseIso`, `daysBetween`
- `utilities/string.utilities.ts` — `slugify`, `truncate`, `capitalize`
- `utilities/validation.utilities.ts` — `isEmail`, `isUrl`, `isPositiveInt`

Each utility file should stay in one domain. If it grows beyond ~100 lines, split it by subdomain.

#### Exceptions

Co-locate when pieces are **small, uniform, and tightly coupled**:

- **Private type definitions** — types used only by one module can live in that module's file or a shared `{feature}.types.ts`.
- **Enum + related constants** — an enum and its lookup map or default value belong together.

#### Avoid

- **Multiple exported classes in one file** — each class gets its own file.
- **Exported function + class in the same file** — even if related, separate them.
- **Barrel files with logic** — `index.ts` should only re-export, never define.
- **"Helpers" grab bags** — never create `helpers.ts` or `utils.ts` without a domain prefix.
