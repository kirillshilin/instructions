# C-H02 — shai-lint-on-edit | Lint script for PostToolUse hook
# Runs npm run lint:fix on TS/JS files edited by the agent.
# Returns remaining warnings as additionalContext so the agent can fix them.

$FilePath = $env:TOOL_INPUT_FILE_PATH

# Guard: skip if no file path or file doesn't exist
if (-not $FilePath -or -not (Test-Path $FilePath)) { exit 0 }

# Guard: only lint TS/JS files
$ext = [System.IO.Path]::GetExtension($FilePath)
if ($ext -notin '.ts', '.tsx', '.js', '.jsx') { exit 0 }

# Run lint:fix — capture output regardless of exit code
$output = npm run lint:fix -- $FilePath 2>&1 | Out-String
$exitCode = $LASTEXITCODE

# Clean exit = no remaining issues
if ($exitCode -eq 0) { exit 0 }

# Feed remaining warnings back to the agent as additionalContext
$result = @{
    hookSpecificOutput = @{
        hookEventName     = "PostToolUse"
        additionalContext = "Lint warnings remain in $FilePath after auto-fix. Fix these issues:`n$output"
    }
}

$result | ConvertTo-Json -Depth 3 -Compress
