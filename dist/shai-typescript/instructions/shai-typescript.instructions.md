---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Coding Standards

TypeScript conventions for architecture, structure, and patterns not covered by ESLint or the compiler.

## File-name → type → folder routing

Before creating any new `.ts` file, decide its unit type and use the routing table in [rules/03-one-unit-per-file.rule.md](rules/03-one-unit-per-file.rule.md).

The filename suffix (`.model.ts`, `.schema.ts`, `.service.ts`, `.component.ts`, `.command.ts`, `.options.ts`, `.builder.ts`, `.utilities.ts`) and folder (`models/`, `schemas/`, `services/`, `components/`, `hooks/`, `commands/`, `utilities/`) together encode what lives inside. Filename = kebab-case of the exported symbol with its role word stripped (`UserSchema` → `user.schema.ts`).

For specifics on yargs commands and Zod schemas, see `shai-yargs-command` and `shai-zod-schema`.

## Rules

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


### Folder Structure — TypeScript

Keep folders flat and semantically named.

#### Principles

- **Flat over nested** — one level of grouping is usually enough. Reconsider
    any subfolder inside another subfolder.
- **Semantic names** — folders should describe what they hold: `models`,
    `services`, `hooks`, `components`, `utilities`, `middleware`, `guards`.
- **Feature folders when appropriate** — in larger apps, group by feature
    first, then by kind.
- **No unnecessary depth** — if a folder has only one child, it shouldn't exist.

#### Shared / Utility Folders

All `utilities/` and `shared/` folders must include a `README.md` that indexes
every export with a one-line description. Read it before adding a new utility.

Utility files use `utilities/{group}.utilities.ts`, for example
`utilities/date.utilities.ts` and `utilities/string.utilities.ts`.

#### TypeScript / Frontend Projects

**Small project:**

```
src/
├── components/
├── hooks/
├── models/
├── services/
└── utilities/
└── schemas/
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
    ├── schemas/
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

Why: deep nesting makes imports harder and files slower to find.


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


### Imports — TypeScript

Use aliases and barrels across module boundaries. Use direct sibling imports
only inside the same local folder module.

#### Rules

- **Prefer aliases first** — import shared code from stable aliases such as `@/models`, `@/utilities`, `@/services`, not from long relative paths.
- **Import through barrels at module boundaries** — when importing from another folder module, target its public entrypoint (`@/services`, `../services`,  `./models`), not an internal file.
- **Direct sibling imports stay local** — only files already inside the same folder module may import sibling files directly, such as `./payment.model` or `./payment.client`.
- **Outside consumers use the folder surface** — code outside that folder must not reach into `../services/payment/payment.service` or similar deep paths.
- **One public import surface per folder** — reusable folders should expose a barrel and consumers should import only from it.

#### Preferred

```typescript
import { User, OrderStatus } from "@/models";
import { formatCurrency, slugify } from "@/utilities";
import { paymentService } from "@/services";
```

```typescript
import { paymentClient } from "./payment.client";
import { PaymentRequest } from "./payment.model";
```

```typescript
import { paymentService } from "../services";
```

#### Avoid

```typescript
import { User } from "../../models/user.model";
import { slugify } from "@/utilities/string.utilities";
import { paymentService } from "../services/payment/payment.service";
import { paymentClient } from "../services/payment/payment.client";
```

Why: aliased, barreled imports keep boundaries explicit and hide private file
layout.

### Logging — TypeScript

Keep logs sparse by default. Add detailed logging only when the user asks.

#### Rules

- **Minimal by default** — log meaningful lifecycle checkpoints only, such as
	validation start, external API calls, and operation results.
- **Consistent prefix** — use `[module > unit]` so logs stay searchable.
- **Pre-operation logs** — add one blank line before `console.log(...)`.
- **Post-operation logs** — add one blank line after `console.log(...)`.
- **No sensitive data** — never log secrets, tokens, passwords, or full PII.
- **Prefer useful payloads** — log concise context objects or results.

#### Pre-operation example

```typescript
// space goes here
console.log("[module > unit] Before Some logging message ", parameters);
someLogic(parameters);
```

#### Post-operation example

```typescript
const result = someLogic(parameters);
console.log("[module > unit] Before Some logging message ", result);
// space goes here
```

#### Avoid

- Repetitive "entered function" logs in every function.
- Logging inside tight loops unless explicitly requested for deep diagnostics.
- Leaving temporary debug logs in production-facing code after debugging is done.

## Constants

Before applying constant naming rules, read and use this reference first:

- [rules/04-constants.rule.md](rules/04-constants.rule.md)
