# 09 — Build-time validation (`npm run check`)

## Problem

`scripts/build.js` resolves partials but performs no validation. Errors only surface at install time or in the user's editor.

## Checks to add

Create `scripts/check.js` (or merge into `build.js` with a `--check` flag):

1. **Partial resolution** — every `{path/to.rule.md}` reference resolves to an existing file. Fail otherwise.
2. **Orphan partials** — every `*.rule.md` / `*.partial.md` is referenced from at least one instruction. Warn otherwise.
3. **`applyTo` glob lint** — parse with the same library used by VS Code (or `picomatch`); fail on invalid syntax.
4. **Frontmatter schema** — every `.instructions.md` has `applyTo`, `id`, `priority`, `status`. Every `SKILL.md` has `name`, `description`, `id`, `priority`, `status`. (Depends on task 01.)
5. **Length budget** — built instruction files: warn at 120 lines, fail at 200 (task 03).
6. **Reference doc drift** — regenerate `reference.md` and `git diff --exit-code` (task 02).
7. **Markdownlint** — `markdownlint-cli2` over `src/**/*.md`.
8. **Link check** — relative links resolve; dead anchors fail.
9. **ID uniqueness** — no two assets share an `id`.
10. **`related:` integrity** — every ID listed in any `related:` array exists.

## Wiring

- `npm run check` runs all of the above, no file writes.
- `npm run build` runs `check` first, then resolves partials into `dist/`.
- CI runs `npm run check` on every PR.

## Acceptance criteria

- [ ] `npm run check` exits non-zero on any failure listed above.
- [ ] CI workflow added under `.github/workflows/`.
- [ ] All current files pass the checks (fix or grandfather as needed).
