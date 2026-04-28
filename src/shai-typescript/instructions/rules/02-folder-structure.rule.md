---
id: T-I01-r02
priority: must
status: done
related: [T-I01]
---
### Folder Structure — TypeScript

Keep folders flat and semantically named.

#### Principles

- **Flat over nested** — one level of grouping is usually enough. Reconsider
    any subfolder inside another subfolder.
- **Semantic names** — folders should describe what they hold: `models`,
    `services`, `hooks`, `components`, `utilities`, `middleware`, `guards`.
- **Feature folders when appropriate** — in larger apps, group by feature
    first, then by kind.
- **No unnecessary depth** — if a folder has only one child, it shouldn't exist.

#### Shared / Utility Folders

All `utilities/` and `shared/` folders must include a `README.md` that indexes
every export with a one-line description. Read it before adding a new utility.

Utility files use `utilities/{group}.utilities.ts`, for example
`utilities/date.utilities.ts` and `utilities/string.utilities.ts`.

#### TypeScript / Frontend Projects

**Small project:**

```
src/
├── components/
├── hooks/
├── models/
├── services/
└── utilities/
└── schemas/
```

**Larger project (feature-based):**

```
src/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── models/
│   └── services/
├── orders/
│   ├── components/
│   ├── models/
│   └── services/
└── shared/
    ├── components/
    ├── hooks/
    ├── schemas/
    └── utilities/
```

**Avoid:**

```
src/
├── components/
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── buttons/
│   │   │   │   └── primary/
```

Why: deep nesting makes imports harder and files slower to find.
