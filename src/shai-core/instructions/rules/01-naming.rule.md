---
id: C-I01-r01
priority: must
status: done
related: [C-I01]
---
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
