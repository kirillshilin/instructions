---
description: Extract the selected section into a reference (SKILL.md) or rule partial (*.instructions.md) and replace it with a load instruction or partial reference
---

Extract the selected text from the current file into a sibling folder, then replace the selection with a short link or partial reference. Pick the mode based on the host file.

## Mode A — `SKILL.md` → `references/`

1. Create `references/{name}.md` (preferably 1-word filename) containing the extracted content. Propose and ask the user for the name if unclear.
2. Replace the extracted text in `SKILL.md` with a single line followed by a bullet linking to the new file — matching the pattern already used in this skill.
   - For `references/{name}.md`: `Before {doing X}, read and use this reference first:`
   - For `references/{name}.template.{extension}`: `To {do X} or create {asset}, use this template:`
3. Keep the replacement under 3 lines. The point is progressive disclosure — `SKILL.md` stays short, details live in references.
4. If the selection is a codeblock (starting and ending with ` ``` `), extract its content to `references/{name}.template.{extension}`. Keep the supporting text in `SKILL.md`, move only the code to the template file, and use the template phrasing from rule 2.

## Mode B — `*.instructions.md` → `rules/`

1. Create `rules/{NN}-{name}.rule.md` next to the instructions file, where `{NN}` is a two-digit ordinal matching the rule's position (e.g. `01`, `02`, …) and `{name}` is a short kebab-case slug. Propose and ask the user for `{name}` if unclear; infer `{NN}` from existing siblings (or omit `{NN}-` if siblings don't use ordinals, e.g. `library-documentation.rule.md`).
2. The rule file contains only the extracted rule body — no frontmatter, no `applyTo`. Start with a short `## {Rule Title}` heading if the selection didn't already include one.
3. Replace the extracted text in the instructions file with a single-line partial reference on its own line, surrounded by blank lines:

   `{rules/{NN}-{name}.rule.md}`

4. The build script resolves these partials into `dist/`. Source-only `*.rule.md` files are excluded from build output, so do not link to them — reference them only via the `{...}` partial syntax.

## General

- Paths in partial references / links are relative to the file containing the reference.
- Do not duplicate content — the extracted text must be removed from the host file once moved.
- If the host file is neither `SKILL.md` nor `*.instructions.md`, ask the user which mode to use.
