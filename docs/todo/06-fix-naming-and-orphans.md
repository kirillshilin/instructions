# 06 — Fix naming, numbering, and orphan partials

Small consistency fixes.

## Tasks

### File slug vs reference name

- `src/shai-core/instructions/shai-packagejson.instructions.md` → rename to `shai-package-json.instructions.md` (matches reference ID `shai-package-json`).

### Duplicate rule numbering

In `src/shai-typescript/instructions/rules/`:

- `05-logging.rule.md`
- `05-zod-schema.rule.md`

Renumber so each prefix is unique. Suggested:

- `05-logging.rule.md` stays.
- `05-zod-schema.rule.md` → `08-zod-schema.rule.md`.

Update any references in the parent `.instructions.md` files.

### Orphan partial

`src/shai-core/instructions/rules/library-documentation.rule.md` is not referenced from any `.instructions.md`. Either:

- Inline it into `shai-documentation.instructions.md`, or
- Delete it.

### Corrupted status emoji

In `src/reference.md`, replace `�` glyphs with the intended status emoji (🟢/🟡/🔴). Affected rows include `C-H02`, `R-I01`, `V-S03` (and possibly more — search for `�`).

> Note: this becomes moot once task 02 generates the reference from frontmatter.

## Acceptance criteria

- [ ] No two rule files share the same NN- prefix in the same folder.
- [ ] All `*.rule.md` and `*.partial.md` files are referenced from at least one instruction (orphan check in task 09).
- [ ] All files in `src/` resolve to their reference ID slug.
- [ ] `src/reference.md` contains no `�` characters.
