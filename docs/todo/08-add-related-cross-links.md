# 08 — Add cross-linking "Related" sections

## Problem

Cross-references between assets are sparse. Only `shai-react-components` cleanly references companion skills. The asset network is invisible to the reader (and to the model when picking what to invoke).

## Pattern

Every instruction and skill ends with:

```md
## Related

- Skill: `shai-unit-testing-ts` (T-S02) — for writing/refactoring tests
- Skill: `shai-scaffold-ts-workspace` (T-S01) — for new TS projects
- Instruction: `shai-zod-schema` (T-I04) — when defining DTOs
```

Each entry is **one line**: type, slug, ID, and a short "when to use".

## Acceptance criteria

- [ ] Every instruction has a `## Related` section listing companion skills/agents (or "none" if standalone).
- [ ] Every skill's `SKILL.md` references prerequisite/companion instructions in its description or a Related section.
- [ ] Frontmatter `related:` array (task 01) is the source of truth; the Related section can be generated from it.
