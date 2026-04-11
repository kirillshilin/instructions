# Genkit App Boilerplate

Folder structure and starter files for a Firebase Genkit AI application.

## Target Structure

```
{project}/
├── src/
│   ├── flows/
│   │   ├── hello.flow.ts
│   │   └── index.ts
│   ├── prompts/
│   │   └── index.ts
│   ├── lib/
│   │   ├── genkit.ts
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

**`src/index.ts`**:

```typescript
import { startFlowServer } from "genkit/server";
import "./flows/index.js";

startFlowServer({ port: 3000 });
```

> **Alternative entry:** If the user wants to run flows via the Genkit CLI dev UI instead of as a server, use:
>
> ```typescript
> import "./flows/index.js";
> // Flows are registered — run with `npx genkit start`
> ```

## Genkit Instance

**`src/lib/genkit.ts`** — centralized Genkit configuration:

```typescript
import { genkit } from "genkit";
// Import the user's chosen AI plugin:
// import { googleAI } from "@genkit-ai/google-ai";
// import { openAI } from "@genkit-ai/openai";

export const ai = genkit({
  plugins: [
    // Add the configured plugin here, e.g.:
    // googleAI({ apiKey: process.env.GOOGLE_API_KEY }),
  ],
});
```

> **Adapt this file** based on the user's chosen AI plugin from Step 1. Replace the placeholder comments with the actual import and plugin configuration.

**`src/lib/index.ts`** (barrel):

```typescript
export { ai } from "./genkit.js";
```

## Flows

**`src/flows/index.ts`** (barrel):

```typescript
export { helloFlow } from "./hello.flow.js";
```

**`src/flows/hello.flow.ts`** — starter flow:

```typescript
import { z } from "genkit";
import { ai } from "../lib/genkit.js";

export const helloFlow = ai.defineFlow(
  {
    name: "hello",
    inputSchema: z.string().describe("The name to greet"),
    outputSchema: z.string(),
  },
  async (name) => {
    const { text } = await ai.generate({
      prompt: `Say hello to ${name} in a creative way.`,
    });
    return text;
  },
);
```

## Other Barrels

**`src/prompts/index.ts`**, **`src/types/index.ts`** — create as empty barrel files:

```typescript
// Re-export prompts/types as they are created
```

## package.json Scripts (Genkit-specific)

```json
{
  "scripts": {
    "start": "node --env-file=.env dist/index.js",
    "dev": "npx genkit start -- tsx --env-file=.env src/index.ts",
    "dev:server": "tsx watch --env-file=.env src/index.ts"
  }
}
```

> `npm run dev` starts the Genkit dev UI (http://localhost:4000) with hot reload. `npm run dev:server` starts the flow server directly without the dev UI.

## Default .env

```
# AI Plugin API Key
# Uncomment the one matching your plugin:
# GOOGLE_API_KEY=
# OPENAI_API_KEY=
```

> Replace with the actual env var name for the user's chosen AI plugin.

## Notes

- **Genkit includes Zod** — `genkit` re-exports `z` from Zod. No need to install Zod separately for schema definitions.
- **One flow per file** — name files as `{name}.flow.ts`. Keep flows focused on a single task. Compose complex pipelines by calling flows from other flows.
- **Prompts as files** — for complex prompts, use Genkit's `.prompt` file format in a `prompts/` directory. For simple prompts, inline them in the flow.
- **Testing flows** — test flows by calling them directly with `helloFlow("World")`. Genkit flows are plain async functions.
