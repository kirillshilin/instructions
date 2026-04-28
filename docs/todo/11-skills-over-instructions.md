# 11 — Bias growth toward skills over instructions

## Policy, not a one-shot task

The reference plans 50+ skills; only a handful exist (`shai-software-design`, `shai-tdd-feature`, the product skills). Today the system is **mostly always-on instructions** — the failure mode that drives task 03.

## Rule

When adding a new asset, default to a **skill** unless:

1. The rule must be enforced on **every** matching file edit (e.g. naming, imports), AND
2. The rule fits in ≤ 120 lines built, AND
3. The model would otherwise produce non-compliant output by default.

Otherwise, build a skill — invoked on demand, paid for only when used.

## Examples

| Need                                         | Asset type  |
| -------------------------------------------- | ----------- |
| "Always pin exact versions in package.json"  | instruction |
| "Walk me through scaffolding a TS workspace" | skill       |
| "Audit this file for security issues"        | skill       |
| "PascalCase types, camelCase vars"           | instruction |
| "Deep tsconfig reference with edge cases"    | skill       |

## Acceptance criteria

- [ ] Policy added to `copilot-instructions.md` and `reference.md`.
- [ ] `shai-create-tool` skill prompts the user to justify "why instruction, not skill?" before creating an instruction.
