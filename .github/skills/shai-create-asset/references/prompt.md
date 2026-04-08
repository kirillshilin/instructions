# Prompt Asset Reference

Format spec and writing guide for `.prompt.md` files in the SHAI plugin system.

> **Source documentation:** For the full VS Code spec, read
> [vscode-docs/03-prompt-files.md](vscode-docs/03-prompt-files.md)
> — covers prompt file format, locations, input variables, and invocation.

> **Content sources:** Always use `/find-skills` to search for community skills
> covering the same domain — a skill's workflow can inform prompt structure.
> For VS Code prompt files specifically, fetch `vscode-copilot-customization`
> (danielsitek) — includes prompt templates and the prompt-vs-skill decision matrix.

## Important: Prompt vs Skill Decision

Within plugins, prompt-like behaviors should generally be delivered as **skills**
(invocable via slash command). Standalone `.prompt.md` files are for
workspace-level use only.

Ask the user: "Should this be a workspace prompt file (.prompt.md) or converted
to a skill within the plugin? Prompts are simpler but less portable."

## File Format

```markdown
---
name: "prompt-name"                  # Slash command: /prompt-name
description: "What this prompt does"
agent: "agent"                       # ask | agent | plan | custom-agent-name
model: "Claude Sonnet 4"            # Optional — overrides model picker
tools:                               # Optional — available tools
  - "search/codebase"
  - "vscode/askQuestions"
---

# Prompt Title

{Task instructions in Markdown}

Use #tool:toolName to reference tools in the body.
```

## Frontmatter Fields

| Field           | Required | Notes                                         |
| --------------- | -------- | --------------------------------------------- |
| `name`          | No       | Slash command name. Defaults to filename      |
| `description`   | No       | Brief description of the prompt's purpose     |
| `argument-hint` | No       | Hint text shown in chat input                 |
| `agent`         | No       | Which agent runs this. Default: current agent |
| `model`         | No       | Override model. Default: current model        |
| `tools`         | No       | Whitelist of available tools                  |

## File Location

Workspace-level: `.github/prompts/{name}.prompt.md`
In staging: `drafts/{plugin}/prompts/{name}.prompt.md`

Note: In the final plugin format, prompts should become skills. The
`drafts/` prompt files are for review before deciding whether to convert.

## Input Variables

Use `${input:variableName}` syntax for user-provided values:

```markdown
Create a ${input:httpMethod:GET|POST|PUT|DELETE} endpoint at
`${input:path:/api/resource}`.
```

Or use `#tool:vscode/askQuestions` for structured input gathering.

## Writing Guide

Prompts are lightweight and single-purpose. Keep them short and focused.

- **One task per prompt** — don't combine unrelated operations
- **Reference shared context** via Markdown links to instructions or docs
- **Set the right agent mode**: `ask` for read-only analysis, `agent` for edits, `plan` for planning
- **Restrict tools** to what's actually needed

## Interview Questions for Prompts

1. "Is this better as a prompt or a skill? (Prompts are simpler, skills are more portable)"
2. "Which agent mode — ask (read-only), agent (can edit), or plan?"
3. "What tools does this need access to?"
4. "Should this prompt ask the user for any inputs? What inputs?"
5. "Should it reference any existing instructions or coding standards?"

## Template

```markdown
---
name: "{prompt-name}"
description: "{What this prompt does}"
agent: "{ask|agent|plan}"
tools:
  - "{tool-1}"
---

# {Prompt Title}

{Clear instructions for the task.}

## Requirements
- {Requirement 1}
- {Requirement 2}

## Output
{What the result should look like.}
```
