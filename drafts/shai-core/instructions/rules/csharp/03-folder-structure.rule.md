---
applyTo: "**/*.cs,**/*.csproj,**/*.sln"
---

# Folder Structure — C#

See [universal folder structure rules](../03-folder-structure.rule.md) for
shared principles (flat over nested, semantic names).

## .NET Projects

Follow the flat-semantic principle per project:

```
MyApp.Domain/
├── Models/
├── Services/
├── Interfaces/
└── Exceptions/
```

Split into separate projects (Domain, Application, Infrastructure) rather than
deep folder hierarchies within a single project.
