#!/usr/bin/env bash
# C-H02 — shai-lint-on-edit | Lint script for PostToolUse hook
# Runs npm run lint:fix on TS/JS files edited by the agent.
# Returns remaining warnings as additionalContext so the agent can fix them.

FILE_PATH="${TOOL_INPUT_FILE_PATH:-}"

# Guard: skip if no file path or file doesn't exist
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Guard: only lint TS/JS files
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

# Run lint:fix — capture output regardless of exit code
LINT_OUTPUT=$(npm run lint:fix -- "$FILE_PATH" 2>&1)
LINT_EXIT=$?

# Clean exit = no remaining issues
if [ "$LINT_EXIT" -eq 0 ]; then
  exit 0
fi

# Feed remaining warnings back to the agent as additionalContext.
# Uses node for safe JSON escaping (node is available — we just ran npm).
node -e "
  var file = process.argv[1];
  var output = process.argv[2];
  var msg = 'Lint warnings remain in ' + file + ' after auto-fix. Fix these issues:\n' + output;
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: msg
    }
  }));
" "$FILE_PATH" "$LINT_OUTPUT"
