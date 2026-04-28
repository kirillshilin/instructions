# 12 — Miscellaneous cleanups

Low-impact but cheap. Batch into one PR.

## Tasks

### asset-rules.json schema

`src/asset-rules.json` uses inline `"comment"` keys as a workaround for JSON not supporting comments. Either:

- Rename to `asset-rules.jsonc` and use real `//` comments, or
- Add a `"$schema"` reference to a small JSON schema and drop the `comment` keys.

### Empty plugin folders

`shai-nextjs/` has no `instructions/` folder. `plugin.json` should declare `"instructions": []` explicitly so the installer doesn't silently no-op (covered by task 10, mentioned here for tracking).

### Build script regression test

`scripts/build.js` skips `rules/` folders and `*.rule.md` / `*.partial.md` files. Add a fixture under `scripts/__fixtures__/` and a test that:

- Builds the fixture.
- Asserts `dist/` does not contain `rules/` or `.rule.md` files.
- Asserts a `.instructions.md` with `{rules/foo.rule.md}` resolves correctly.

### `obsolete/` audit

Several `copilot-instructions-{N}.md` files in `obsolete/` are unreferenced legacy drafts. Either:

- Mine them for content into draft assets (already partially done — many are 🟡 status), or
- Delete the ones whose content is fully migrated.

Document the policy: "files in `obsolete/` may be deleted once their content lands in `src/`."

## Acceptance criteria

- [ ] `asset-rules` is either `.jsonc` or schema-validated.
- [ ] `scripts/build.js` has a unit test covering partial resolution and `rules/` exclusion.
- [ ] `obsolete/` contents are either migrated or annotated with a TODO referencing the target asset ID.
