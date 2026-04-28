---
id: T-I01-r05
priority: should
status: done
related: [T-I01]
---
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