---
id: C-I01-r06
priority: must
status: done
related: [C-I01]
---
### Error Handling

Let unexpected errors propagate.

Use a global or top-level error handler to catch, log, and respond
consistently.

Use `try/catch` only when you must act on the error locally:

- Translate the error into a domain-specific type or message.
- Handle a known failure and recover or return a meaningful fallback.
- Clean up resources. Prefer `finally`, `using`, or `defer`.

Do not wrap code in `try/catch` just to silence or re-throw the same error.
