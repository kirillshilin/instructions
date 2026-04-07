---
applyTo: "**"
---

# General Coding Standards

Universal conventions that apply to every file in the project. Framework-specific
extensions live in their own instruction files — these rules are the shared
foundation.

## Philosophy

Write code that is **intentionally simple**. Every abstraction earns its place
by solving a real, named problem. Prefer a well-named function over a comment
explaining convoluted logic. Prefer a direct call over two layers of indirection
for a single use case.

- **Pragmatic over dogmatic** — "Prefer X because Y" over "ALWAYS do X." If the
  reason doesn't apply, the rule may not either.
- **Composition over inheritance** — build from small, focused, independently
  testable pieces. Inheritance is fine for true "is-a" up to 2 levels.
- **Fail fast** — surface errors at the point of origin. Don't silently swallow
  failures or return ambiguous values where an error is clearer.
- **YAGNI** — build for the current requirement. Design for known variation
  axes, not guessed future ones.

## Rules

{rules/01-naming.rule.md}

{rules/typescript/01-naming.rule.md}

{rules/csharp/01-naming.rule.md}

{rules/02-member-ordering.rule.md}

{rules/03-folder-structure.rule.md}

{rules/typescript/03-folder-structure.rule.md}

{rules/csharp/03-folder-structure.rule.md}

## Early Returns

Prefer early returns and guard clauses to reduce nesting — validate preconditions
at the top, then proceed with the main logic unindented.

```typescript
// preferred
function process(input: string | null): Result {
  if (!input) return Result.empty();
  if (!isValid(input)) throw new InvalidInputError(input);

  // main logic, no nesting
  return transform(input);
}
```

## No Inline Parameters

Extract method arguments into named variables before calling the method. The
call site should read like a sentence — `service.Process(command)`, not
`service.Process(new ProcessCommand(id, items, DateTime.UtcNow))`.

```csharp
// ✅ Good
var command = new ProcessCommand(id, items, DateTime.UtcNow);
var result = service.Process(command);

// ❌ Bad — inlining hides what's being passed
var result = service.Process(new ProcessCommand(id, items, DateTime.UtcNow));
```

```typescript
// ✅ Good
const options = { retries: 3, timeout: 5000 };
const result = await fetchData(url, options);

// ❌ Bad
const result = await fetchData(url, { retries: 3, timeout: 5000 });
```

**When inlining is acceptable:**
- Single primitive argument whose meaning is obvious: `list.Contains(id)`
- Fluent builder chains: `new UserBuilder().WithName("Alice").Build()`

## Comments

- **No comments during scaffolding** — freshly generated code speaks for itself.
- **Class summary** — add a brief summary comment on classes unless asked not to.
- **No comments on private methods** — if a private method needs a comment, it
  probably needs a better name or extraction.
- **Inline comments** — only in complex or long methods with multiple conditions
  or non-obvious logic.
- **Full documentation** — only on library-exported public APIs, or when
  explicitly requested, or by the documentation agent.

## Constants

Use `ALL_CAPS` for all `const` declarations to clearly distinguish immutable
values from mutable variables.

```typescript
const MAX_RETRIES = 3;
const API_BASE_URL = "/api/v1";
const DEFAULT_TIMEOUT = 5000;
```

```csharp
public const int MAX_RETRIES = 3;
public const string API_BASE_URL = "/api/v1";
```
