---
name: create-skill
description: >
  Scaffold a new GitHub Copilot agent skill following the conventions of this
  repository and the official GitHub Copilot guidelines. Use this skill when
  asked to create, define, or generate a new skill for this repository.
---

# Create Skill

## When to Use

- The user asks to create, define, or scaffold a new agent skill.
- Copilot needs detailed, task-specific instructions that should only be loaded
  when relevant (rather than always-on custom instructions).
- A reusable, repeatable process needs to be encoded as a skill so it can be
  shared across tasks or contributors.

## Process

1. **Clarify intent** — confirm the skill's name, purpose, and when Copilot
   should invoke it. Ask whether any supplementary scripts, examples, or
   resource files should be included alongside the `SKILL.md`.

2. **Choose a directory name** — use a lowercase, hyphen-separated name that
   clearly identifies the skill's domain (e.g., `webapp-testing`,
   `database-migration`). Create the directory at
   `.github/skills/<skill-name>/`.

3. **Write the YAML frontmatter** — include at minimum:
   - `name`: Lowercase, hyphen-separated identifier matching the directory name.
   - `description`: Multi-line YAML block (`>`) that explains what the skill
     does and explicitly states when Copilot should use it (the "Use this skill
     when…" trigger sentence is required — Copilot relies on it for selection).

4. **Write the Markdown body** — structure the body with the following sections,
   adapting content to the specific skill:
   - **When to Use** — bullet list of trigger conditions.
   - **Process** — numbered, step-by-step instructions Copilot should follow.
   - **Output Format** — Markdown code block showing the expected output
     structure, with placeholder values.
   - **Best Practices** — bullet list of tips and common pitfalls to avoid.

5. **Add supplementary resources** (optional) — if scripts or example files are
   needed, create them in the same directory and reference them explicitly in
   the *Process* section of `SKILL.md`.

6. **Validate the file** — before saving, confirm:
   - The file is named exactly `SKILL.md` (case-sensitive).
   - The `description` includes a clear "Use this skill when…" sentence.
   - The *Process* section is actionable and step-by-step.
   - Any referenced scripts or files are present in the directory.

7. **Save the file** — write the file to
   `.github/skills/<skill-name>/SKILL.md` in the repository.

8. **Report** — output a summary: file path, `name`, `description`, and a
   brief rationale for key design decisions.

## Output Format

The produced skill follows this structure:

````markdown
---
name: <kebab-case-name>
description: >
  <One or two sentences describing what the skill does.>
  Use this skill when <specific trigger conditions>.
---

# <Human-Readable Skill Title>

## When to Use

- <Trigger condition 1>
- <Trigger condition 2>

## Process

1. **<Step name>** — <description>
2. **<Step name>** — <description>

## Output Format

```markdown
<Example output structure with placeholder values>
```

## Best Practices

- <Tip 1>
- <Tip 2>
````

## Best Practices

- The `description` frontmatter field is the most important part of a skill —
  Copilot reads it to decide whether to load the skill; make it precise.
- Use "Use this skill when…" as a sentence in the description to give Copilot
  an explicit trigger condition.
- Keep skills focused on a single task or domain; broad skills with vague
  instructions are less useful than narrow, detailed ones.
- Include concrete output templates so Copilot produces consistent artefacts
  every time the skill is used.
- Prefer scripts over prose for repeatable, mechanical steps — a shell script
  is less error-prone than a multi-step manual instruction.
- Test the skill on a real task after creation and refine the instructions
  based on observed behaviour.
