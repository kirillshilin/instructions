---
applyTo: "**/*.ts,**/*.tsx"
---

# Folder Structure — TypeScript

See [universal folder structure rules](../03-folder-structure.rule.md) for
shared principles (flat over nested, semantic names, feature folders).

## TypeScript / Frontend Projects

**Small project:**
```
src/
├── components/
├── hooks/
├── models/
├── services/
└── utils/
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
    └── utils/
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
