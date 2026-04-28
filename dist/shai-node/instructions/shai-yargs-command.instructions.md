
# Yargs Command Structure

## Builder Separation

Define the yargs `builder` in a dedicated `{name}.options.ts` file alongside the command file — never inline it.

**Why:** Inline builders grow large and mix argument schema with command logic. Extracting options keeps each file focused, makes the argument shape testable in isolation, and prevents the command file from becoming a config dump.

**Preferred:**

```
commands/
├── deploy.command.ts
└── deploy.options.ts
```

`deploy.options.ts`

```typescript
import type { Argv } from "yargs";

export function deployBuilder(yargs: Argv) {
  return yargs.option("env", { type: "string", demandOption: true, description: "Target environment" }).option("dry-run", { type: "boolean", default: false });
}
```

`deploy.command.ts`

```typescript
import type { ArgumentsCamelCase } from "yargs";
import { deployBuilder } from "./deploy.options";

export const command = "deploy";
export const describe = "Deploy to a target environment";
export const builder = deployBuilder;

export function handler(argv: ArgumentsCamelCase<ReturnType<typeof deployBuilder>["argv"]>) {
  // command logic only
}
```

**Avoid:**

```typescript
// deploy.command.ts — builder inline
export const builder = (yargs: Argv) =>
  yargs.option("env", { type: "string", demandOption: true }).option("dry-run", { type: "boolean", default: false }).option("verbose", { type: "boolean", default: false });
// ... grows without bound
```

## Related

- Instruction: `shai-typescript-coding-standards` (T-I01)
