# Instruction Asset Reference

Format spec and writing guide for `.instructions.md` files in the SHAI plugin system.

> **Source documentation:** For the full VS Code spec, read
> [vscode-docs/02-instructions.md](vscode-docs/02-instructions.md)
> — covers instruction types, scoping, precedence, and settings.

> **Content sources:** Always use `/find-skills` to search for community skills
> covering the same domain — even when creating an instruction, not a skill.
> A community skill's content (patterns, rules, checklists) can be converted
> into instruction rules. For VS Code customization topics specifically, fetch
> `vscode-copilot-customization` (danielsitek) and `custom-agent-creator` (prulloac).

## File Format

```markdown
---
name: "Human-Readable Name"          # Optional — shown in UI
description: "Brief scope description" # Optional — hover text
applyTo: "**/*.ts,**/*.tsx"           # Glob pattern — which files trigger this
---

# Instruction Title

## Section 1
- Rule with reasoning
- Code examples (preferred and avoided)

## Section 2
...
```

## Frontmatter Fields

| Field         | Required | Notes                                                     |
| ------------- | -------- | --------------------------------------------------------- |
| `name`        | No       | Display name. Defaults to filename if omitted             |
| `description` | No       | Short description shown on hover                          |
| `applyTo`     | No       | Glob pattern. Omit or `**` for all files. Always ask user |

## File Location

Within a plugin: `{plugin}/instructions/{name}.instructions.md`
In staging: `drafts/{plugin}/instructions/{name}.instructions.md`

## Writing Style — Hybrid Approach

SHAI instructions use a hybrid style: rules with reasoning, grouped by theme,
with concrete code examples showing preferred and avoided patterns.

### Pattern: Rule with reasoning

```markdown
- Prefer `interface` over `type` for object shapes — interfaces support
  declaration merging and produce clearer error messages. Use `type` for
  unions, intersections, and mapped types where `interface` can't express
  the shape.
```

### Pattern: Show-don't-tell (preferred vs avoided)

```markdown
**Preferred:**
```typescript
interface UserProfile {
  readonly id: string;
  name: string;
  email: string;
}
```

**Avoid:**
```typescript
type UserProfile = {
  id: any;
  name: string;
  email: string;
}
```
Why: `any` bypasses type checking entirely. Use `unknown` for truly
unknown types, then narrow with type guards.
```

### Pattern: Grouped rules with intro

```markdown
## Naming Conventions

Consistent naming reduces cognitive load and makes code searchable.

- PascalCase for types, interfaces, enums, classes, components
- camelCase for variables, functions, methods, properties
- `_camelCase` for private fields (not `#private` — it complicates debugging)
- ALL_CAPS for compile-time constants only
- Descriptive names over abbreviations (`getUserProfile` not `getUP`)
```

## Cross-Referencing

Link to related instructions using Markdown links:

```markdown
Apply the [general coding guidelines](./shai-general-coding-standards.instructions.md)
to all code in addition to these framework-specific rules.
```

## Prescriptiveness Calibration

- **Strict** for: security patterns, data integrity, naming that affects tooling
- **Flexible** for: style choices, formatting, comment density
- **Explain WHY** for everything — models make better context-dependent decisions
  when they understand the reasoning

## Interview Questions for Instructions

Ask the user:

1. "The reference doc suggests `applyTo: {pattern}`. Does this match your needs, or should we adjust?"
2. "What are the most important rules — the ones that should be strictly enforced?"
3. "Any gotchas or anti-patterns you've hit repeatedly that we should call out?"
4. "Should this reference any other instructions? (e.g., TypeScript rules referencing Core coding standards)"
5. "How detailed should code examples be — minimal snippets or full realistic patterns?"
6. "Any framework versions or library preferences to call out specifically?"
7. "Are there patterns from other projects or teams you've seen that you want to adopt or explicitly avoid?"
8. "Should any rules have exceptions? When is it OK to break them?"

## Template

```markdown
---
applyTo: "{glob-pattern}"
---
# {Instruction Title}

{One-line purpose statement explaining what these conventions achieve.}

## {Category 1}

{Brief intro explaining the theme.}

- {Rule} — {reasoning}
- {Rule} — {reasoning}

**Preferred:**
```{language}
{good example}
```

**Avoid:**
```{language}
{bad example}
```
Why: {explanation}

## {Category 2}
...

## Gotchas

- {Non-obvious fact that defies reasonable assumptions}
- {Common mistake with explanation of why it's wrong}
```
