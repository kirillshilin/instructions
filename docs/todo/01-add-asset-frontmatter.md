# 01 — Add structured frontmatter to all assets

## Problem

`reference.md` is hand-maintained and drifts from reality. Status emoji are corrupted (`�`) in places, file slugs disagree with reference names (`shai-packagejson` vs `shai-package-json`), and there is no machine-readable source of truth per asset.

## Goal

Every `.instructions.md` and `SKILL.md` carries enough metadata to generate the reference doc, validate consistency, and power tooling.

## Proposed frontmatter

```yaml
---
id: T-I01
applyTo: "**/*.ts,**/*.tsx"   # instructions only
priority: must                # must | should | could | wont
status: done                  # not-started | draft | done
related: [T-S02, T-I04, C-I01]
---
```

For skills, replace `applyTo` with the existing skill fields (`name`, `description`).

## Acceptance criteria

- [ ] Every existing instruction file has `id`, `priority`, `status`, `related`.
- [ ] Every existing `SKILL.md` has `id`, `priority`, `status`, `related`.
- [ ] IDs match `src/reference.md` table values.
- [ ] No status drift between frontmatter and reference table (verified manually for now; task 09 automates).

## Out of scope

- Generating reference.md (task 02).
- Schema validation in build (task 09).
