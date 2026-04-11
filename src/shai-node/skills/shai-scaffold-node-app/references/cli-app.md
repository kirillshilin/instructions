# CLI App Boilerplate

Folder structure and starter files for a command-line tool using yargs.

## Target Structure

```
{project}/
├── src/
│   ├── commands/
│   │   ├── greet.command.ts
│   │   └── index.ts
│   ├── lib/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── dist/
├── .env
├── .env.example
├── .gitignore
├── tsconfig.json
├── jest.config.ts
├── package.json
└── README.md
```

## Entry Point

**`src/index.ts`** — include shebang for direct execution:

```typescript
#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { greetCommand } from "./commands/index.js";

yargs(hideBin(process.argv))
  .command(greetCommand)
  .demandCommand(1, "You need to specify a command")
  .strict()
  .help()
  .alias("h", "help")
  .version()
  .alias("v", "version")
  .parse();
```

## Commands

**`src/commands/index.ts`** (barrel):

```typescript
export { greetCommand } from "./greet.command.js";
```

**`src/commands/greet.command.ts`** — starter command:

```typescript
import type { CommandModule } from "yargs";

interface GreetArgs {
  name: string;
}

export const greetCommand: CommandModule<{}, GreetArgs> = {
  command: "greet <name>",
  describe: "Greet someone by name",
  builder: (yargs) =>
    yargs.positional("name", {
      describe: "The name to greet",
      type: "string",
      demandOption: true,
    }),
  handler: (args) => {
    console.log(`Hello, ${args.name}!`);
  },
};
```

## Other Barrels

**`src/lib/index.ts`**, **`src/types/index.ts`** — create as empty barrel files:

```typescript
// Re-export as modules are created
```

## package.json (CLI-specific)

Add the `bin` field and adjust scripts:

```json
{
  "name": "{project}",
  "bin": {
    "{cli-name}": "dist/index.js"
  },
  "scripts": {
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts",
    "build": "tsc"
  }
}
```

> Replace `{cli-name}` with the user's chosen command name (defaults to the project name).

After `npm run build`, the CLI can be linked for local testing:

```bash
npm link
{cli-name} greet World
```

## Default .env

```
# CLI Configuration
# Add API keys or config values as needed
```

## Starter Test

**`src/commands/greet.command.test.ts`**:

```typescript
describe("greet command", () => {
  it("exists and has correct structure", () => {
    // Import the command to verify it's properly typed
    const { greetCommand } = require("./greet.command.js");

    expect(greetCommand.command).toBe("greet <name>");
    expect(greetCommand.describe).toBeDefined();
    expect(greetCommand.handler).toBeInstanceOf(Function);
  });
});
```

## Notes

- **Shebang line** — the `#!/usr/bin/env node` must be the first line in `src/index.ts`. Modern `tsc` (TS 5.5+) preserves shebangs in the output. If using an older version, add a post-build step to prepend it: `echo '#!/usr/bin/env node' | cat - dist/index.js > temp && mv temp dist/index.js`.
- **One command per file** — name files as `{name}.command.ts`. Register all commands in the barrel.
- **Global options** — add shared flags (like `--verbose`, `--json`) in `index.ts` before `.command()` calls using `.option()`.
- **Exit codes** — use `process.exitCode = 1` for errors, not `process.exit(1)`. This allows cleanup handlers to run.
