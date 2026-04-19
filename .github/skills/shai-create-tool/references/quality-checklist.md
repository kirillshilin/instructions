# Quality Checklist

Run this checklist after generating any SHAI tool. Report results to the user.

> **Source documentation:** Cross-check against the canonical VS Code docs:
> [02-instructions.md](vscode-docs/02-instructions.md),
> [03-prompt-files.md](vscode-docs/03-prompt-files.md),
> [04-custom-agents.md](vscode-docs/04-custom-agents.md),
> [05-agent-skill.md](vscode-docs/05-agent-skill.md),
> [06-hooks.md](vscode-docs/06-hooks.md),
> [07-plugins.md](vscode-docs/07-plugins.md).

## Universal Checks (all tool types)

- [ ] **File location**: Tool is in the correct `src/{plugin}/{type}/` path
- [ ] **Naming**: Filename matches the tool name from the reference doc
- [ ] **YAML frontmatter**: Valid YAML syntax, no tabs, proper quoting
- [ ] **Required fields**: All required frontmatter fields present
- [ ] **Purpose match**: Content aligns with the purpose column in the reference doc
- [ ] **Cross-references**: Links to related tools use correct relative paths
- [ ] **Philosophy alignment**: Rules explain WHY, prescriptiveness is calibrated
- [ ] **No over-explanation**: Doesn't explain what the model already knows
- [ ] **Examples**: Code examples are realistic and use the user's conventions
- [ ] **Private fields**: Uses `_name` convention (not `#private`)
- [ ] **Consistency**: Naming conventions match across all referenced tools

## Instruction-Specific Checks

- [ ] **applyTo pattern**: Glob pattern confirmed with user
- [ ] **Hybrid style**: Has rules + reasoning + code examples
- [ ] **Preferred/Avoid examples**: At least one show-don't-tell pair
- [ ] **Cross-references**: Links to parent instructions (e.g., Core standards)
- [ ] **Grouped sections**: Rules organized by theme with brief intros

## Skill-Specific Checks

- [ ] **name field**: Lowercase, hyphens only, no `--`, matches directory name, ≤64 chars
- [ ] **description**: ≤1024 chars, includes WHAT and WHEN, "pushy" trigger phrases
- [ ] **Progressive disclosure**: Body <500 lines, details in references/
- [ ] **Directory structure**: SKILL.md at root, optional scripts/, references/, assets/
- [ ] **When to Use section**: Clear trigger conditions listed
- [ ] **Workflow steps**: Numbered, actionable steps

## Agent-Specific Checks

- [ ] **Persona**: Focused specialist with clear role boundaries
- [ ] **Tool preset**: Uses a standard preset (read-only/edit-capable/full) as baseline
- [ ] **Tool justification**: Non-standard tools have documented rationale
- [ ] **Handoffs**: If configured, target agents exist in the reference doc
- [ ] **Constraints**: Explicitly states what the agent does NOT do
- [ ] **Output format**: Defines how the agent presents results

## Hook-Specific Checks

- [ ] **Valid event names**: Uses exact PascalCase event names from the spec
- [ ] **Windows support**: Has `windows` field if cross-platform needed
- [ ] **Timeout**: Reasonable timeout set (15-60 seconds typical)
- [ ] **File naming**: Follows the naming convention (post-tool.json, etc.)
- [ ] **Security**: No hardcoded secrets, inputs validated
- [ ] **Scripts**: Referenced scripts exist and are executable

## Prompt-Specific Checks

- [ ] **Skill consideration**: User confirmed this should be a prompt, not a skill
- [ ] **Agent mode**: Correct mode (ask/agent/plan) for the task
- [ ] **Tool restrictions**: Only necessary tools listed
- [ ] **Single purpose**: Prompt does one thing well
- [ ] **Input variables**: Uses `${input:...}` or askQuestions for user input

## Post-Validation

After the checklist passes:
1. Display the full generated content to the user
2. Report any checklist items that needed attention
3. Ask: "Ready to finalize, or do you want to adjust anything?"
4. On approval: update the tool status in `02-shai-tool-reference.md` from 🔴/🟡 to 🟢
