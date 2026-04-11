---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Coding Standards

TypeScript conventions for architecture, structure, and patterns not covered by ESLint or the compiler.


## Rules

{rules/01-naming.rule.md}

{rules/02-folder-structure.rule.md}

## Constants

Use `ALL_CAPS` for all `const` declarations to clearly distinguish immutable
values from mutable variables.

```typescript
const MAX_RETRIES = 3;
const API_BASE_URL = "/api/v1";
const DEFAULT_TIMEOUT = 5000;
```
