---
description: Extract a section from SKILL.md into a references/ file and replace it with a load instruction
---

Extract the selected text from the current SKILL.md into a file under the `references/` folder next to it.

1. Create `references/{name}.md` (preferable 1 word filename) containing the extracted content. Propose and ask user for the name if unclear.
2. Replace the extracted text in SKILL.md with a single line followed by a bullet linking to the new file — matching the pattern already used in this skill.
   - For `references/{name}.md`: `Before {doing X}, read and use this reference first:`
   - For `references/{name}.template.{extension}`: `To {do X} or create {asset}, use this template:`
3. Keep the replacement under 3 lines. The point is progressive disclosure — SKILL.md stays short, details live in references.
4. If the selection is a codeblock (starting and ending with "\`\`\`"), extract its content to `references/{name}.template.{extension}`. In this case keep the supporting text in the original file, move only the code to the template file, and use the template phrasing from rule 2.
