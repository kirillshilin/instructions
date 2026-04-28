---
id: T-I02
name: shai-typescript-testing
applyTo: "**/*.spec.ts"
priority: should
status: done
related: [T-I01, T-S02]
description: "TypeScript unit test conventions: colocated .spec.ts files, file-name describe blocks, explicit API coverage, and AAA comments."
---

# TypeScript Unit Testing

Rules for `*.spec.ts` unit tests.

Use [shai-unit-testing-ts](../skills/shai-unit-testing-ts/SKILL.md) for mocks, factories, and test execution.

Framework-specific test instructions may add rules. They must not weaken these ones.

## Rules

{rules/07-unit-testing.rule.md}
