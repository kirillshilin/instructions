# Agent Tool Reference

Format spec and writing guide for `.agent.md` files in the SHAI plugin system.

> **Source documentation:** For the full VS Code spec, read
> [vscode-docs/04-custom-agents.md](vscode-docs/04-custom-agents.md)
> — covers agent file format, tools, model selection, handoffs, and agent modes.

> **Content sources:** Always use `/find-skills` to search for community skills
> covering the same domain — even when creating an agent, not a skill.
> A skill's workflow steps become agent guidelines; a skill's checklist becomes
> agent validation steps. For agent creation specifically, fetch
> `custom-agent-creator` (prulloac) — has a 6-step workflow, validation checklist,
> and concrete examples (security reviewer, docs writer, code reviewer, planner).

## File Format

```markdown
---
name: "Agent Name"
description: >
  What the agent does and when to use it.
  Use this agent when {specific trigger conditions}.
tools:
  - tool-1
  - tool-2
model:
  - "Claude Opus 4.5"
  - "GPT-5.2"
handoffs:
  - label: "Next Step"
    agent: agent
    prompt: "Continue with the plan above."
    send: false
---

# Purpose

{One paragraph: role, expertise, primary goal.}

# Guidelines

1. **{Guideline}** — {explanation}
2. **{Guideline}** — {explanation}

# Workflow

## {Primary Task}
1. {Step}
2. {Step}
```

## Frontmatter Fields

| Field         | Required | Notes                                                     |
| ------------- | -------- | --------------------------------------------------------- |
| `name`        | No       | Display name. Title Case                                  |
| `description` | Yes      | Include "Use this agent when..." trigger sentence         |
| `tools`       | No       | Whitelist of allowed tools. Use preset groups (see below) |
| `model`       | No       | String or priority array (fallback chain)                 |
| `handoffs`    | No       | Suggested next-step transitions to other agents           |
| `target`      | No       | `vscode` or `github-copilot` or omit for both             |

## Tool Preset Groups

SHAI agents use three standard tool presets. Each agent picks one as a
baseline, then adjusts as needed.

### read-only (for architects, planners, reviewers)
```yaml
tools:
  - search/codebase
  - search/usages
  - web/fetch
```

### edit-capable (for implementers, testers, scaffolders)
```yaml
tools:
  - search/codebase
  - search/usages
  - web/fetch
  - edit
  - terminal
```

### full (for orchestrators with subagent access)
```yaml
tools:
  - agent
  - search/codebase
  - search/usages
  - web/fetch
  - edit
  - terminal
```

Always start from a preset and add/remove tools based on the agent's
actual needs. Document WHY non-standard tools are included.

## File Location

Within a plugin: `{plugin}/agents/{agent-name}.agent.md`
In staging: `src/{plugin}/agents/{agent-name}.agent.md`

## Writing Persona — Focused Specialist

SHAI agents are focused specialists. Each agent has a clear role and stays
in character. The persona section should:

- State the agent's area of expertise clearly
- Define what the agent does AND what it doesn't do
- Set the tone (analytical for reviewers, methodical for architects, etc.)

```markdown
# Purpose

You are a .NET architect specializing in Clean Architecture and domain-driven
design. You design solution structures, define layer boundaries, and recommend
patterns — but you do not write implementation code. When the design is ready,
hand off to the default agent for implementation.
```

## Handoff Configuration

Use selective handoffs between agent pairs that make logical sense:

```yaml
handoffs:
  - label: "Implement Design"
    agent: agent              # Built-in or custom agent name
    prompt: "Implement the architecture outlined above."
    send: false               # false = user reviews first
```

Common handoff patterns:
- `architect` → `agent` (design → implement)
- `planner` → `agent` (plan → implement)
- `reviewer` → `agent` (review → fix issues)
- `tester` → `agent` (test failures → fix)

## Interview Questions for Agents

Ask the user:

1. "What tool preset fits best — read-only, edit-capable, or full? Any tools to add or remove?"
2. "Should this agent hand off to another agent when done? Which one?"
3. "What should this agent explicitly NOT do? (constraints are as important as capabilities)"
4. "Any specific model preferences for this agent?"
5. "What's the typical workflow — what steps does this agent follow?"
6. "Should this agent reference any instructions or skills in its body?"
7. "How should the agent format its output — structured report, inline comments, checklist?"
8. "Are there any domain-specific guidelines or gotchas this agent should know?"

## Template

```markdown
---
name: "{Title Case Name}"
description: >
  {What the agent does}.
  Use this agent when {trigger conditions}.
tools:
  - {tool-1}
  - {tool-2}
model:
  - "Claude Opus 4.5"
handoffs:
  - label: "{Next Step Label}"
    agent: agent
    prompt: "{Handoff context}"
    send: false
---

# Purpose

{One paragraph: role, expertise, boundaries.}

# Guidelines

1. **{Guideline 1}** — {explanation with reasoning}
2. **{Guideline 2}** — {explanation with reasoning}

# Workflow

## {Primary Task}

1. **{Step name}** — {what to do and why}
2. **{Step name}** — {what to do and why}

# Output Format

{Description of how the agent presents its results.}
```
