---
applyTo: "**"
---

# General Coding Standards

Shared conventions for all files. Framework-specific rules live in separate instruction files.

## Philosophy

Write **intentionally simple** code. Every abstraction must solve a real, named problem. Prefer a well-named function over a comment; prefer a direct call over unnecessary indirection.

- **Pragmatic over dogmatic** — "Prefer X because Y." If the reason doesn't apply, the rule may not either.
- **Composition over inheritance** — small, focused, independently testable pieces. Inheritance is fine for true "is-a" up to 2 levels.
- **Fail fast** — surface errors at the origin. Don't swallow failures or return ambiguous values.
- **YAGNI** — build for the current requirement. Design for known variation axes, not guessed future ones.

## Rules

{rules/01-naming.rule.md}

{rules/02-member-ordering.rule.md}

{rules/03-early-returns.rule.md}

{rules/04-no-inline-parameters.rule.md}

{rules/05-comments.rule.md}

