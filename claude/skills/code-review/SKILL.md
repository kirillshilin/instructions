---
name: code-review
description: >
  Systematic C# code review process covering architecture, correctness, async
  patterns, error handling, naming, and test coverage. Use this skill when
  reviewing a pull request, a changed file, or a feature branch in a .NET
  project.
---

# C# Code Review

## When to Use

- Reviewing a pull request or feature branch in a .NET project.
- Conducting a self-review before raising a PR.
- Auditing a file or class for quality issues.

## Process

1. **Gather the diff** — run `git diff main...HEAD` (or the target branch) to
   see all changed files.

2. **Check architecture boundaries** — for each changed `.cs` file:
   - Domain files must not import from `Infrastructure` or `Presentation`.
   - Application files must not import from `Infrastructure`.
   - Use `Grep` to confirm no forbidden `using` directives are present.

3. **Check async correctness** — scan for:
   - `.Result` or `.Wait()` calls (sync-over-async deadlock risk).
   - `async void` methods (unobservable exceptions).
   - Missing `CancellationToken` parameters on public async methods.
   - Missing `Async` suffix on async methods.
   - `ConfigureAwait(false)` presence in library code.

4. **Check error handling** — verify:
   - No bare `catch (Exception)` without rethrow or boundary-level justification.
   - Null arguments guarded with `ArgumentNullException.ThrowIfNull`.
   - Domain-level errors use custom exception types, not generic exceptions.

5. **Check naming and style** — verify:
   - Classes, methods, and properties are PascalCase.
   - Private fields are `_camelCase`.
   - Interfaces are prefixed with `I`.
   - Test methods follow `Should_<ExpectedBehavior>_When<Condition>`.
   - No magic strings or magic numbers (use constants or enums).

6. **Check test coverage** — for each new or changed class:
   - Confirm a corresponding test file exists.
   - Confirm new public methods have at least a happy-path test.
   - Flag missing edge-case tests (null input, empty collection, boundary value).

7. **Check performance** — look for:
   - Loops that issue database queries (N+1).
   - Missing `.AsNoTracking()` on read-only EF Core queries.
   - `string` concatenation in loops (use `StringBuilder` or interpolation).
   - Large collections loaded into memory when pagination is possible.

8. **Compile findings** — categorise each issue:
   - **Critical** — will cause a bug, security issue, or data loss.
   - **Major** — degrades correctness, performance, or maintainability significantly.
   - **Minor** — style, naming, or non-critical improvements.

9. **Produce the review** — output a structured Markdown report.

## Output Format

```
## Code Review — <PR / Branch Name>

### Summary
<2–3 sentences describing the overall quality and the most important finding.>

### Issues

#### Critical
- **`src/Services/OrderService.cs:47`** — `.Result` call on async method risks deadlock.
  Suggestion: replace with `await`.

#### Major
- **`src/Application/Orders/Commands/PlaceOrderCommandHandler.cs:30`** — missing
  `CancellationToken` propagation to `_repository.AddAsync()`.

#### Minor
- **`tests/Services/OrderServiceTests.cs`** — test `Should_PlaceOrder` is missing
  an assertion on the returned order ID.

### Suggestions
- Consider extracting the order validation logic in `OrderService` to a domain
  method on the `Order` aggregate.

### Verdict
✅ Approved | ⚠️ Approved with suggestions | ❌ Changes requested
```

## Best Practices

- Report issues with file paths and line numbers — vague feedback is hard to act on.
- Distinguish style preferences from correctness issues; never block a PR on
  pure style if the code follows the project's established patterns.
- Suggest, don't dictate — phrase non-critical feedback as suggestions.
- Acknowledge good patterns explicitly; a review that only lists problems is
  less useful than one that also reinforces what is working well.
