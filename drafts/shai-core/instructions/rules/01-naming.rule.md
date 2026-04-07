---
applyTo: "**"
---

# Naming Conventions

Consistent, concise naming reduces cognitive load and makes code searchable.
The goal: **shortest meaningful name that avoids ambiguity.**

## Universal Principles

- **Short names** — use the shortest name that is still unambiguous in context.
  One word is ideal. Two or three words only when a single word would be unclear.
- **No abbreviations** — spell out words in full. Abbreviations fracture
  searchability and force readers to decode context.
- **Allowed abbreviations** — commonly understood terms that are clearer short:
  `id`, `db`, `url`, `api`, `config`, `env`, `auth`, `args`, `params`, `docs`.
- **Reflect the data type** — a variable name should hint at what it stores.
  `UserInfo` as a variable name is redundant — name it `user`. `OrderResponse`
  → `order`. The variable name is the concept; the type carries the shape.
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

## Language-Specific Extensions

- TypeScript: [typescript/01-naming.rule.md](typescript/01-naming.rule.md)
- C#: [csharp/01-naming.rule.md](csharp/01-naming.rule.md)
