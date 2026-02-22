---
name: create-agent
description: >
  Scaffold a new GitHub Copilot custom agent profile following the conventions
  of this repository and the official GitHub Copilot guidelines. Use this skill
  when asked to create, define, or generate a new agent for this repository.
---

# Create Agent

## When to Use

- The user asks to create, define, or scaffold a new custom agent.
- A new specialised Copilot agent is needed for a recurring task or domain.
- An existing agent needs to be restructured to meet the repository conventions.

## Process

1. **Clarify intent** — confirm the agent's name, purpose, primary tasks, and
   the tools it should have access to. Ask if the agent needs specific MCP
   server tools or should be restricted to a subset of built-in tools.

2. **Choose a filename** — derive a kebab-case filename from the agent name.
   Only the characters `.`, `-`, `_`, `a-z`, `A-Z`, `0-9` are allowed.
   Save the file as `.github/agents/<filename>.agent.md`.

3. **Write the YAML frontmatter** — include at minimum:
   - `name`: Title-cased human-readable label.
   - `description`: Multi-line YAML block (`>`) that explains what the agent
     does and explicitly states when it should be used.
   - `tools`: Minimal, explicit list of tools the agent requires.

4. **Write the Markdown prompt** — structure the body with the following
   top-level sections, adapting content to the specific agent:
   - **Purpose** — one-paragraph summary of the agent's role.
   - **Guidelines** — numbered list of behavioural rules.
   - **Capabilities** — Markdown table listing what the agent can do.
   - **Workflow** — step-by-step process for each major task the agent handles.
   - **Output Format** — templates or descriptions of expected output.

5. **Validate the file** — before saving, confirm:
   - The `description` is clear and includes a "Use this agent when…" trigger.
   - The `tools` list contains only tools that are genuinely needed.
   - The prompt body is specific enough to constrain and guide agent behaviour.
   - The filename follows the naming rules.

6. **Save the file** — write the file to `.github/agents/<filename>.agent.md`
   in the repository.

7. **Report** — output a summary: file path, `name`, `description`, `tools`
   used, and a brief rationale for key design decisions.

## Output Format

The produced agent profile follows this structure:

```markdown
---
name: <Title Case Name>
description: >
  <One or two sentences describing what the agent does.>
  Use this agent when <specific trigger conditions>.
tools:
  - <tool-1>
  - <tool-2>
---

# Purpose

<One paragraph explaining the agent's role and primary goal.>

# Guidelines

1. **<Guideline 1>** — <explanation>
2. **<Guideline 2>** — <explanation>

# Capabilities

| Capability | Description |
|---|---|
| **<Name>** | <Description> |

# Workflow

## <Primary Task>

1. <Step 1>
2. <Step 2>

# Output Format

<Describe the format(s) the agent should use when responding.>
```

## Best Practices

- Keep the `tools` list minimal — only include tools the agent will actually
  use; overly broad tool access reduces predictability.
- Make the `description` specific: it is used by Copilot to decide when to
  suggest the agent; a vague description leads to incorrect selections.
- Prefer numbered, step-by-step workflows over prose — they are easier for the
  agent to follow consistently.
- Include concrete output templates wherever the agent is expected to produce
  structured artefacts.
- Test the agent on a real task after creation and refine the prompt based on
  observed behaviour.
