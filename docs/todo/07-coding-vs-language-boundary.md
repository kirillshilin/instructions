# 07 — Define shai-coding vs language-plugin boundary

## Problem

`shai-coding` includes naming, member ordering, comments, error handling. `shai-typescript` repeats naming. The boundary isn't written down, so duplication will grow.

## Rule

> **`shai-coding` is language-agnostic.** Language plugins state only **deltas** — what's specific to that language — and link back to `shai-coding` rather than restating universal rules.

Document this in `src/reference.md` introduction (or in `shai-core/plugin.json` description) so future contributors follow it.

## Audit & fix

- Read `src/shai-typescript/instructions/rules/01-naming.rule.md`.
- Compare with `src/shai-core/instructions/rules/01-naming.rule.md`.
- Keep only TS-specific naming rules (e.g. interface prefixes, type aliases, enum casing).
- Universal points (PascalCase types, camelCase vars, `_private`) live only in `shai-core`.
- Add a `> See also: shai-coding` line at the top of the TS naming rule.

Repeat for any other duplicated rules across language plugins (member ordering, comments, error handling).

## Acceptance criteria

- [ ] No rule statement appears verbatim in two plugins.
- [ ] Boundary is documented in one place (reference.md intro).
- [ ] Each language-specific rule file links back to its `shai-coding` counterpart.
