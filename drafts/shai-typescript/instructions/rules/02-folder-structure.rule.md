---
applyTo: "**/*.ts,**/*.tsx"
---

# Folder Structure — TypeScript

Keep folders **flat** and **semantically named**. Avoid deep nesting, but don't
dump everything into one directory either.

## Principles

- **Flat over nested** — one level of semantic grouping is usually enough. If
  you need a subfolder inside a subfolder, reconsider the decomposition.
- **Semantic names** — folders describe *what kind* of thing lives inside:
  `models`, `services`, `hooks`, `components`, `utilities`, `middleware`, `guards`.
- **Feature folders when appropriate** — for larger apps, group by feature first,
  then by kind within. Keep the inner structure flat.
- **No unnecessary depth** — if a folder has only one child, it shouldn't exist.

## Shared / Utility Folders

All `utilities/`, and `shared/` folders **must include a
`README.md`** indexing every export with a one-line description. Before adding a
new utility, read the README to check for existing equivalents.

## TypeScript / Frontend Projects

**Small project:**
```
src/
├── components/
├── hooks/
├── models/
├── services/
└── utilities/
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
Why: deep nesting makes imports painful and files hard to locate. If a folder
has only one child, it shouldn't exist.
