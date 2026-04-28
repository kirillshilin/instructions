---
id: T-I03
name: shai-tsconfig-standards
applyTo: "**/tsconfig*.json"
priority: could
status: done
related: [T-I01]
description: "Strictest TypeScript compiler options, root+sub-app inheritance, test config, and project-specific path aliases."
---

# tsconfig Standards

Enforce the most demanding TypeScript compiler configuration to prevent `any` leakage, null-reference errors, and type ambiguity at compile time — not at runtime, not in code review.

---

## File Structure

For multi-app projects, always use a **root base + per-app extension** hierarchy. Never duplicate compiler options across apps.

```
project-root/
├── tsconfig.base.json        ← shared strictest options — no include/exclude
├── tsconfig.json             ← optional root editor experience (extends base)
├── apps/
│   ├── frontend/
│   │   ├── tsconfig.json     ← extends base, adds jsx/lib/paths
│   │   └── tsconfig.test.json
│   └── backend/
│       ├── tsconfig.json
│       └── tsconfig.test.json
└── packages/
    └── shared/tsconfig.json
```

- `tsconfig.base.json` — compiler options only, no `include`/`exclude`/`files`. It is a template, not a build target.
- App `tsconfig.json` — extends base, adds only what is app-specific (`outDir`, `rootDir`, `lib`, `jsx`, `paths`).
- `tsconfig.test.json` — extends the app config; override only what tests need.

---

## Base Config — Strictest Compiler Options

`tsconfig.base.json` at the project root. Non-negotiable for all apps.

```json
{
  "compilerOptions": {
    // strictness
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,

    // unused & reachability
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,

    // module / resolution
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "isolatedModules": true,

    // output
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

**Avoid** enabling individual strict flags instead of `strict: true` — you miss new members of the strict family in future TypeScript versions. Always enable `strict`, then add extras on top.

---

## App-Specific Configs

Each app extends `tsconfig.base.json` and adds only what it requires (`outDir`, `rootDir`, `lib`, `jsx`, `types`, `paths`). Start minimum; add only with a concrete reason.

| App                | Add to base                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| Node backend       | `"lib": ["ES2022"]`, `"types": ["node"]`, `"outDir": "./dist"`, `"rootDir": "./src"`             |
| React + Vite       | `"lib": ["ES2022", "DOM", "DOM.Iterable"]`, `"jsx": "react-jsx"`, `"types": ["vite/client"]`     |
| Angular            | `"lib": ["ES2022", "DOM"]`, `"experimentalDecorators": true`, `"useDefineForClassFields": false` |
| Firebase Functions | `"lib": ["ES2022"]`, `"types": ["node"]`, `"outDir": "lib"`, `"module": "CommonJS"`              |

---

## Test Config

`tsconfig.test.json` extends the app config. Start minimum — include test files, exclude build output. Add overrides only with a concrete reason.

Common additions when justified:

- `"noUnusedParameters": false` — test fixtures and callback stubs trigger this without benefit
- `"types": ["jest"]` or `"types": ["vitest/globals"]` — global `describe`/`it`/`expect`
- `"module": "CommonJS"` — Jest + Node without ESM transform

**Do not** relax `strictNullChecks`, `noImplicitAny`, or `exactOptionalPropertyTypes` — tests must type-check with the same rigor as production.

---

## Path Aliases

Use path aliases to avoid deep relative imports and ease folder refactoring.

### Rules

- **Only add an alias if the folder exists.** `@services` with no `src/services/` directory creates confusion.
- When creating a new folder under `src/`, add its alias to the app's `tsconfig.json` at the same time.
- Mirror every `paths` entry in `vite.config.ts` / `webpack.config.js` / `jest.config.ts` — bundlers do not read tsconfig paths automatically.
- Use `@/` as the catch-all root alias pointing to `src/`. Add named aliases on top for hot folders.

### Standard alias set

Add only the aliases for folders that exist:

| Alias           | Resolves to        |
| --------------- | ------------------ |
| `@/*`           | `src/*` (always)   |
| `@components/*` | `src/components/*` |
| `@models/*`     | `src/models/*`     |
| `@services/*`   | `src/services/*`   |
| `@utilities/*`  | `src/utilities/*`  |
| `@hooks/*`      | `src/hooks/*`      |
| `@store/*`      | `src/store/*`      |
| `@shared/*`     | `src/shared/*`     |
| `@lib/*`        | `src/lib/*`        |
| `@types/*`      | `src/types/*`      |
| `@config/*`     | `src/config/*`     |

**Preferred:**

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@components/*": ["./src/components/*"],
    "@services/*": ["./src/services/*"]
  }
}
```

**Avoid** declaring aliases for folders that do not exist yet — they mislead contributors and auto-import tooling.

### Bundler mirror (Vite)

```typescript
// vite.config.ts
import path from "path";

export default {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@services": path.resolve(__dirname, "./src/services"),
    },
  },
};
```

---

## Gotchas

- **`strict: true` does not enable `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`** — they require explicit opt-in because they force the most code changes.
- **`exactOptionalPropertyTypes` breaks `obj.x = undefined`** — use `delete obj.x` or type as `x?: string | undefined`. Plan a migration pass before enabling on legacy code.
- **`isolatedModules` is required for Vite/esbuild/swc** — they transpile files individually. The flag warns when re-exporting a type without `type` keyword and similar single-file-unsafe patterns.
- **tsconfig `paths` are not picked up by bundlers** — duplicate them in `vite.config.ts`, `webpack.config.js`, `jest.config.ts` (`moduleNameMapper`). Skipping this makes type-check pass but runtime/test fail.
- **`noUnusedParameters` in tests** — prefix intentionally unused params with `_` (e.g. `(req, _res, next)`), or relax the flag only in `tsconfig.test.json`.
- **`moduleResolution: "bundler"`** requires TypeScript 5.0+ and is correct for Vite/webpack. For Node without a bundler use `"node16"` or `"nodenext"`. Avoid the legacy `"node"` mode.
- **Do not put `outDir` in `tsconfig.base.json`** — relative paths resolve from the extending file, causing surprises. Keep `outDir`/`rootDir` per app.
