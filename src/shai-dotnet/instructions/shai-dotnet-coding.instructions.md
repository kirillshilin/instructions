---
id: D-I01
name: shai-dotnet-coding-standards
applyTo: "**/*.cs"
priority: must
status: done
related: []
---

# .NET / C# Coding Standards

Conventions for C# and .NET projects. Formatting and style are enforced by ReSharper and static code analysis — these rules cover architecture, structure, and patterns that tooling does not catch.


## Rules

{rules/01-naming.rule.md}

{rules/02-folder-structure.rule.md}

## Constants

Use `ALL_CAPS` for all `const` declarations to clearly distinguish immutable
values from mutable variables.

```csharp
public const int MAX_RETRIES = 3;
public const string API_BASE_URL = "/api/v1";
```
