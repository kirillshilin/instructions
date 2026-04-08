## Error Handling

Prefer **fail fast** — let unexpected errors propagate. Rely on a global/top-level error handler (e.g. middleware, `process.on('uncaughtException')`, ASP.NET exception filter) to catch, log, and respond to unhandled exceptions consistently.

Use `try/catch` **only** when you have a specific reason to act on the error locally:

- You need to **translate** the error into a domain-specific type or message.
- You are handling a **known, expected failure** (e.g. file not found, external API timeout) and can recover or provide a meaningful fallback.
- You need to **clean up resources** (prefer `finally` or language constructs like `using`/`defer` for this).

**Do not** wrap code in `try/catch` just to silence or re-throw the same error — it adds noise without value.
