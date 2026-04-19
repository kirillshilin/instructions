---
description: Extract a section from SKILL.md into a references/ file and replace it with a load instruction
---

Extract the selected text from the current SKILL.md into a file under the `references/` folder next to it.

1. Create `references/{name}.md` (preferable 1 word filename) containing the extracted content. Ask me for the name if unclear.
2. Replace the extracted text in SKILL.md with a single line: `Before {doing X}, read this reference first:` followed by a bullet linking to the new file — matching the pattern already used in this skill.
3. Keep the replacement under 3 lines. The point is progressive disclosure — SKILL.md stays short, details live in references.
