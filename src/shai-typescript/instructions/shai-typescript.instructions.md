---
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript Coding Standards

TypeScript conventions for architecture, structure, and patterns not covered by ESLint or the compiler.

## File-name → type → folder routing

Before creating any new `.ts` file, decide its unit type and use the routing table in [rules/03-one-unit-per-file.rule.md](rules/03-one-unit-per-file.rule.md).

The filename suffix (`.model.ts`, `.schema.ts`, `.service.ts`, `.component.ts`, `.command.ts`, `.options.ts`, `.builder.ts`, `.utilities.ts`) and folder (`models/`, `schemas/`, `services/`, `components/`, `hooks/`, `commands/`, `utilities/`) together encode what lives inside. Filename = kebab-case of the exported symbol with its role word stripped (`UserSchema` → `user.schema.ts`).

For specifics on yargs commands and Zod schemas, see `shai-yargs-command` and `shai-zod-schema`.

## Rules

{rules/01-naming.rule.md}

{rules/02-folder-structure.rule.md}

{rules/03-one-unit-per-file.rule.md}

{rules/06-imports.rule.md}

{rules/05-logging.rule.md}

## Constants

Before applying constant naming rules, read and use this reference first:

- [rules/04-constants.rule.md](rules/04-constants.rule.md)
