# Hook Asset Reference

Format spec and writing guide for hook JSON files in the SHAI plugin system.

> **Source documentation:** For the full VS Code spec, read
> [research/vscode-docs/06-hooks.md](../../../research/vscode-docs/06-hooks.md)
> — covers lifecycle events, JSON schema, environment variables, and security.

> **Content sources:** Always use `/find-skills` to search for community skills
> covering the hook's domain — a skill about linting, formatting, or security
> guards can provide the logic to embed in hook scripts. For VS Code hooks
> specifically, fetch `vscode-copilot-customization` (danielsitek) — includes
> hook file naming conventions and templates.

## File Format

```json
{
  "hooks": {
    "EventName": [
      {
        "type": "command",
        "command": "unix command here",
        "windows": "windows command here",
        "timeout": 30
      }
    ]
  }
}
```

## Supported Events

| Event              | When it fires                 | Common use cases                             |
| ------------------ | ----------------------------- | -------------------------------------------- |
| `SessionStart`     | First prompt of a new session | Initialize resources, validate state         |
| `UserPromptSubmit` | User submits a prompt         | Audit requests, inject context               |
| `PreToolUse`       | Before agent invokes any tool | Block dangerous operations, require approval |
| `PostToolUse`      | After tool completes          | Run formatters, lint, log results            |
| `PreCompact`       | Before context compaction     | Export important context                     |
| `SubagentStart`    | Subagent spawned              | Track nested agent usage                     |
| `SubagentStop`     | Subagent completes            | Aggregate results, cleanup                   |
| `Stop`             | Agent session ends            | Generate reports, cleanup, notifications     |

## File Location & Naming

Within a plugin: `{plugin}/hooks/{name}.json`
In staging: `drafts/{plugin}/hooks/{name}.json`

### Naming convention — one file per responsibility

| Filename           | Event(s)                    | Purpose                      |
| ------------------ | --------------------------- | ---------------------------- |
| `post-tool.json`   | PostToolUse                 | Format/lint after tool calls |
| `session-end.json` | Stop                        | Typecheck/validate at end    |
| `pre-tool.json`    | PreToolUse                  | Block dangerous operations   |
| `subagent.json`    | SubagentStart, SubagentStop | Subagent monitoring          |

Rules:
- Split by responsibility, not by event count
- Group related events (Start + Stop) in one file
- Never merge unrelated events to reduce file count
- Use these exact names for consistency

## Scripts

For complex logic, create scripts in `scripts/` and reference them:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/validate-tool.sh",
        "windows": "powershell -File scripts\\validate-tool.ps1",
        "timeout": 15
      }
    ]
  }
}
```

Scripts should:
- Be self-contained with clear error messages
- Handle both Unix and Windows (provide `windows` field)
- Have a sensible timeout (15-60 seconds)
- Fail fast — surface errors immediately

## Security Checklist

- Review all hook scripts before enabling
- Never hardcode secrets in hook commands
- Validate and sanitize `$TOOL_INPUT_*` variables
- Use `chmod +x` for shell scripts
- Test hooks in isolation before enabling

## Interview Questions for Hooks

1. "What event should trigger this hook?"
2. "Should this run on both Unix and Windows? (provide `windows` field)"
3. "What's the expected timeout — how long should the command take?"
4. "Does this need a custom script or is a one-liner sufficient?"
5. "Should this hook block the agent (PreToolUse) or run after (PostToolUse)?"
6. "Any tools/commands this should NOT apply to?"

## Templates

### PostToolUse — formatter

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "test -f \"$TOOL_INPUT_FILE_PATH\" && npx prettier --write \"$TOOL_INPUT_FILE_PATH\" 2>/dev/null || true",
        "windows": "if exist \"%TOOL_INPUT_FILE_PATH%\" npx prettier --write \"%TOOL_INPUT_FILE_PATH%\" 2>nul",
        "timeout": 30
      }
    ]
  }
}
```

Adapt the formatter to what the project uses (Prettier, Biome, ESLint).
Detect from `package.json` devDependencies.

### PreToolUse — dangerous command guard

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "type": "command",
        "command": "./scripts/validate-tool.sh",
        "windows": "powershell -File scripts\\validate-tool.ps1",
        "timeout": 15
      }
    ]
  }
}
```

### Stop — session end validation

```json
{
  "hooks": {
    "Stop": [
      {
        "type": "command",
        "command": "npm run typecheck 2>&1 | tail -30",
        "windows": "npm run typecheck 2>&1 | Select-Object -Last 30",
        "timeout": 60
      }
    ]
  }
}
```
