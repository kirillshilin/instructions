# 05 — Tighten `applyTo` globs

## Problem

Several instructions match more files than they apply to, paying context cost on irrelevant turns.

## Changes

| File                         | Current `applyTo` | Proposed                    | Reason                                              |
| ---------------------------- | ----------------- | --------------------------- | --------------------------------------------------- |
| shai-tsconfig                | (TS-wide)         | `**/tsconfig*.json`         | Only relevant when editing tsconfig                 |
| shai-zod-schema              | (TS-wide)         | `**/*schema.ts,**/*.dto.ts` | Schema/DTO files, not every TS file                 |
| shai-documentation-standards | `docs/**/*.md`    | `**/README.md,docs/**/*.md` | Standards reference root README, but glob misses it |
| shai-package-json            | `**/package.json` | unchanged                   | Already correct                                     |
| shai-coding                  | `**`              | unchanged                   | Truly universal, but trim content (task 07)         |

## Acceptance criteria

- [ ] Each instruction's `applyTo` matches only files where the rules actually apply.
- [ ] Build validates glob syntax (covered by task 09).
