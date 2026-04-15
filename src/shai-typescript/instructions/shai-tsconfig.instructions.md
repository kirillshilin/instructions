---
applyTo: "**/tsconfig*.json"
description: "Strictest TypeScript compiler options, root+sub-app inheritance, test config, and project-specific path aliases."
---

# tsconfig Standards

Enforce the most demanding TypeScript compiler configuration to prevent `any` leakage, null-reference errors, and type ambiguity at compile time — not at runtime and not in code review.

See also: [typescript-coding-standards](./typescript-coding-standards.instructions.md) for code-level type rules.

---

## File Structure

For projects with multiple TypeScript applications, always use a **root base + per-app extension** hierarchy. Never duplicate compiler options across apps.

```
project-root/
├── tsconfig.base.json        ← shared, strictest options — no include/exclude
├── tsconfig.json             ← optional: root editor experience (extends base)
├── apps/
│   ├── frontend/
│   │   ├── tsconfig.json     ← extends base, adds jsx / lib / paths
│   │   └── tsconfig.test.json← extends apps/frontend/tsconfig.json
│   └── backend/
│       ├── tsconfig.json     ← extends base, adds lib / paths
│       └── tsconfig.test.json← extends apps/backend/tsconfig.json
└── packages/
    └── shared/
        └── tsconfig.json     ← extends base, adds paths
```

Rules:

- `tsconfig.base.json` — compiler options only, no `include`/`exclude`/`files`. It is a template, not a build target.
- App-level `tsconfig.json` — extends base, adds only what is app-specific (`outDir`, `rootDir`, `lib`, `jsx`, `paths`). Keep additions minimal.
- `tsconfig.test.json` — extends the app tsconfig, overrides only what tests need (typically: include test files, relax `noUnusedParameters` if test fixtures trigger it). This is the "mostly clean" starting point — add test-specific options only when you have a concrete reason.

---

## Base Config — Strictest Compiler Options

Place `tsconfig.base.json` at the project root. These are the non-negotiable options for all apps in the project.

```json
{
  "compilerOptions": {
    // --- strictness core ---
    "strict": true, // enables the strict family (see Gotchas)
    "noUncheckedIndexedAccess": true, // arr[i] returns T | undefined — prevents silent undefined reads
    "exactOptionalPropertyTypes": true, // { x?: string } ≠ { x?: string | undefined }
    "noImplicitOverride": true, // must use `override` keyword in subclasses
    "noPropertyAccessFromIndexSignature": true, // dict.key must use dict['key']

    // --- unused code & reachability ---
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,

    // --- module / resolution ---
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "isolatedModules": true, // safe for esbuild/swc/vite — catches module-level side effects

    // --- output quality ---
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true // skip .d.ts checking for 3rd-party libs; focus on your own code
  }
}
```

**Preferred:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

**Avoid:**

```json
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": true
  }
}
```

Why: Enabling individual flags instead of `strict: true` is fragile — you miss new flags added to the strict family in future TypeScript versions. Always enable `strict`, then add _extra_ flags on top.

---

## App-Specific Configs — Minimal Extensions

Each app extends `tsconfig.base.json` and adds only what the app requires. Start with the minimum; add options only when you have a concrete reason.

### Node.js / Backend

See [shared/assets/tsconfig.node.json](../../shared/assets/tsconfig.node.json)

### React / Vite Frontend

See [shared/assets/tsconfig.react.json](../../shared/assets/tsconfig.react.json)

### Angular Frontend

See [shared/assets/tsconfig.angular.json](../../shared/assets/tsconfig.angular.json)

### Firebase Functions

See [shared/assets/tsconfig.firebase.json](../../shared/assets/tsconfig.firebase.json)

---

## Test Config — Clean Slate, Extend As Needed

`tsconfig.test.json` extends the app config. Start with the minimum — only include test files and exclude the build output. Add test-specific overrides only when you have a concrete reason (e.g., a testing framework requires it).

See [shared/assets/tsconfig.test.json](../../shared/assets/tsconfig.test.json)

Common additions when you have a reason:

- `"noUnusedParameters": false` — if test fixtures or callback stubs regularly trigger this without benefit
- `"types": ["jest"]` / `"types": ["vitest/globals"]` — to pick up global `describe`/`it`/`expect`
- `"module": "CommonJS"` — only for Jest + Node.js without ESM transform

**Do not** relax `strictNullChecks`, `noImplicitAny`, or `exactOptionalPropertyTypes` in the test config — tests must type-check with the same rigor as production code.

---

## Path Aliases

Use path aliases to avoid deep relative imports and to make refactoring folder structure less painful.

### Rules

- **Only add an alias if the folder already exists in the project.** An alias for `@services` when there is no `src/services/` directory creates confusion.
- When you create a new folder under `src/`, add its alias to the app's `tsconfig.json` at the same time.
- Mirror every `paths` entry in `vite.config.ts` / `webpack.config.js` / `jest.config.ts` — bundlers do not read tsconfig paths automatically.
- Use `@/` as the catch-all root alias pointing to `src/`. Add named aliases on top of it for the most-accessed folders.

### Standard Alias Set

Add only the aliases for folders that exist in your project:

| Alias           | Resolves to        | Add when…                              |
| --------------- | ------------------ | -------------------------------------- |
| `@/*`           | `src/*`            | always (root alias, covers everything) |
| `@components/*` | `src/components/*` | project has a `src/components/` folder |
| `@models/*`     | `src/models/*`     | project has a `src/models/` folder     |
| `@services/*`   | `src/services/*`   | project has a `src/services/` folder   |
| `@utils/*`      | `src/utils/*`      | project has a `src/utils/` folder      |
| `@hooks/*`      | `src/hooks/*`      | project has a `src/hooks/` folder      |
| `@store/*`      | `src/store/*`      | project has a `src/store/` folder      |
| `@shared/*`     | `src/shared/*`     | project has a `src/shared/` folder     |
| `@lib/*`        | `src/lib/*`        | project has a `src/lib/` folder        |
| `@types/*`      | `src/types/*`      | project has a `src/types/` folder      |
| `@config/*`     | `src/config/*`     | project has a `src/config/` folder     |

**Preferred:**

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@components/*": ["./src/components/*"],
    "@services/*": ["./src/services/*"],
    "@utils/*": ["./src/utils/*"]
  }
}
```

**Avoid:**

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@components/*": ["./src/components/*"],
    "@services/*": ["./src/services/*"],
    "@api/*": ["./src/api/*"],
    "@repositories/*": ["./src/repositories/*"]
  }
}
```

Why: The second example declares aliases for `@api` and `@repositories` that may not exist yet. Unused aliases mislead contributors and auto-import tooling.

### Bundler Mirror (Vite example)

```typescript
// vite.config.ts
import path from "path";

export default {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
};
```

---

## Gotchas

- **`strict: true` does not enable `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`** — these must be added explicitly. They are intentionally excluded from the strict family because they require the most code changes.

- **`exactOptionalPropertyTypes` breaks common patterns** where code assigns `undefined` to clean an optional property: `obj.x = undefined`. With this flag, you must `delete obj.x` or type the property as `x?: string | undefined` explicitly. It catches real bugs — but plan for a migration pass when enabling it on an existing codebase.

- **`isolatedModules` is required for Vite / esbuild / swc** — these tools transpile files individually without type context. With `isolatedModules: true`, TypeScript warns you when you write code that is unsafe in that model (e.g., re-exporting a type without the `type` keyword).

- **tsconfig `paths` are not picked up by the bundler** — TypeScript uses them for type resolution only. You must duplicate them in `vite.config.ts`, `webpack.config.js`, `jest.config.ts` (with `moduleNameMapper`), etc. Forgetting this causes type-check to pass but runtime/test to fail.

- **`noUnusedParameters` in tests** — test stubs and callback fixtures often have unused parameters by design (e.g., `(req, _res, next) => ...`). Either prefix intentionally unused parameters with `_` or relax this flag in `tsconfig.test.json` only.

- **`moduleResolution: "bundler"` is only valid with TypeScript 5.0+** and is the correct setting for Vite/webpack projects. For Node.js without a bundler use `"node16"` or `"nodenext"` to enforce proper ESM import paths. Avoid the legacy `"node"` resolution mode for new projects.

- **Do not put `outDir` in `tsconfig.base.json`** — it causes relative-path resolution issues when extended. Keep `outDir` and `rootDir` in each app-specific config.
