
# General Coding Standards

Shared conventions for all files. Framework-specific rules live in separate instruction files.

## Philosophy

Write **intentionally simple** code. Every abstraction must solve a real, named problem. Prefer a well-named function over a comment; prefer a direct call over unnecessary indirection.

- **Pragmatic over dogmatic** — "Prefer X because Y." If the reason doesn't apply, the rule may not either.
- **Composition over inheritance** — small, focused, independently testable pieces. Inheritance is fine for true "is-a" up to 2 levels.
- **Fail fast** — surface errors at the origin. Don't swallow failures or return ambiguous values.
- **YAGNI** — build for the current requirement. Design for known variation axes, not guessed future ones.

## Rules

### Naming Conventions

Use the shortest meaningful name that stays unambiguous.

#### Universal Principles

- **Short names** — use the shortest name that is still unambiguous in context.
  One word is ideal. Two or three words only when a single word would be unclear.
- **No abbreviations** — spell out words in full. Abbreviations fracture
  searchability and force readers to decode context.
- **Allowed abbreviations** — commonly understood terms that are clearer short:
  `id`, `db`, `url`, `api`, `config`, `env`, `auth`, `args`, `params`, `docs`.
- **Reflect the value** — name the concept, not the type. Use `user`, not
  `UserInfo`. Use `order`, not `OrderResponse`.
- **Plural for collections** — use plural nouns for arrays, lists, and sets
  instead of suffixes like `List` or `Array`.
- **Private fields** — prefix with underscore: `_name`, `_count`. Not `#private`
  (complicates debugging) and not bare `name` (ambiguous with params/locals).

**Preferred:**
```typescript
const users = await getUsers();
const order = await fetchOrder(orderId);
const errors: string[] = [];
```

**Avoid:**
```typescript
const userList = await getUsers();
const orderResp = await fetchOrder(orderId);
const errArr: string[] = [];
```
Why: `userList` adds noise — the plural `users` already signals a collection.
`orderResp` abbreviates without benefit. `errArr` is cryptic.


### Member Ordering

Keep the public API at the top and internals at the bottom.

#### Ordering

Put public members first and private members last. Within each visibility
level, group by kind: fields → constructors → methods.

```
1. Public static fields / constants
2. Public fields / properties
3. Constructor(s)
4. Public methods
5. Protected methods
6. Private fields
7. Private methods
```

Why: readers look for the public API first. Private details matter later.

#### One Item Per File

One class, interface, or component per file — a strong convention in .NET.

**TypeScript exception:** private helper models used only by the main export may
co-locate. Extract them when they grow or are reused.

**Preferred:**

```csharp
UserService.cs          → contains UserService
UserRepository.cs       → contains IUserRepository + UserRepository (interface + impl is OK in .NET)
```

```typescript
user-service.ts         → contains UserService
user.model.ts           → contains User interface
```

**Avoid:**
```
Models.cs               → contains User, Order, Product, Address
helpers.ts              → contains 12 unrelated utility functions
```
Why: multi-item files become dumping grounds. Single-item files are easier to
find and review.


### Early Returns

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


### No Inline Parameters

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


### Comments

- **No comments during scaffolding** — freshly generated code speaks for itself.
- **Class summary** — add a brief summary comment on classes unless asked not to.
- **No comments on private methods** — if a private method needs a comment, it
  probably needs a better name or extraction.
- **Inline comments** — only in complex or long methods with multiple conditions
  or non-obvious logic. Ideally a single line, no more than 80–90 characters.
- **Full documentation** — only on library-exported public APIs, or when
  explicitly requested, or by the documentation agent.


### Error Handling

Let unexpected errors propagate.

Use a global or top-level error handler to catch, log, and respond
consistently.

Use `try/catch` only when you must act on the error locally:

- Translate the error into a domain-specific type or message.
- Handle a known failure and recover or return a meaningful fallback.
- Clean up resources. Prefer `finally`, `using`, or `defer`.

Do not wrap code in `try/catch` just to silence or re-throw the same error.


