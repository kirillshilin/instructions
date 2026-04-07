---
applyTo: "**"
---

# Folder Structure

Keep folders **flat** and **semantically named**. Avoid deep nesting, but don't
dump everything into one directory either.

## Principles

- **Flat over nested** — one level of semantic grouping is usually enough. If
  you need a subfolder inside a subfolder, reconsider the decomposition.
- **Semantic names** — folders describe *what kind* of thing lives inside:
  `models`, `services`, `hooks`, `components`, `utils`, `middleware`, `guards`.
- **Feature folders when appropriate** — for larger apps, group by feature first,
  then by kind within. Keep the inner structure flat.
- **No unnecessary depth** — if a folder has only one child, it shouldn't exist.

## Language-Specific Extensions

- TypeScript: [typescript/03-folder-structure.rule.md](typescript/03-folder-structure.rule.md)
- C#: [csharp/03-folder-structure.rule.md](csharp/03-folder-structure.rule.md)

## Shared / Utility Folders

All `utils/`, `helpers/`, `extensions/`, and `shared/` folders **must include a
`README.md`** indexing every export with a one-line description. Before adding a
new utility, read the README to check for existing equivalents.
