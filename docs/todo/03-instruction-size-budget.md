# 03 — Enforce instruction size budget

## Problem

Auto-loaded instructions for a TS+React+Firebase repo total ~1.4k lines per turn. Most of it is detail the model already knows. This is the single biggest practical issue — context bloat hurts response quality and cost.

## Current sizes (dist/)

| File                    | Lines |
| ----------------------- | ----- |
| shai-react-components   | 424   |
| shai-typescript         | 243   |
| shai-tsconfig           | 239   |
| shai-firebase-functions | 207   |
| shai-coding             | 179   |
| shai-package-json       | 169   |
| shai-typescript-testing | 96    |
| shai-dotnet-coding      | 68    |
| shai-yargs-command      | 56    |
| shai-zod-schema         | 41    |

## Budget

- **Target**: ≤ 120 lines per instruction file (post-partial resolution).
- **Hard fail**: > 200 lines.
- Reference detail goes to a companion skill, loaded on demand.

## Acceptance criteria

- [ ] Build warns when any built instruction exceeds 120 lines.
- [ ] Build fails when > 200 lines.
- [ ] All current instructions are at or under 120 lines, OR have an issue tracking the split (task 04).

## Notes

- Count lines on the **built** file in `dist/`, not source — partials inflate the real load.
- Code blocks count toward the budget; they're tokens too.
