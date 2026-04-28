### Folder Structure — C#

Keep folders **flat** and **semantically named**. Avoid deep nesting, but don't
dump everything into one directory either.

#### Principles

- **Flat over nested** — one level of semantic grouping is usually enough. If
  you need a subfolder inside a subfolder, reconsider the decomposition.
- **Semantic names** — folders describe *what kind* of thing lives inside:
  `Models`, `Services`, `Interfaces`, `Components`, `Extensions`, `Middleware`, `Exceptions`.
- **Feature folders when appropriate** — for larger apps, group by feature first,
  then by kind within. Keep the inner structure flat.
- **No unnecessary depth** — if a folder has only one child, it shouldn't exist.

#### Shared / Utility Folders

All `Extensions/`, and `Shared/` folders **must include a
`README.md`** indexing every export with a one-line description. Before adding a
new utility, read the README to check for existing equivalents.

#### .NET Projects

Follow the flat-semantic principle per project:

```
MyApp.Domain/
├── Models/
├── Services/
├── Interfaces/
└── Exceptions/
```

Split into separate projects (Domain, Application, Infrastructure) rather than
deep folder hierarchies within a single project. Maximum 2 levels of folders per project.
