---
name: debug-e2e-test
description: >
  Systematic workflow for diagnosing and fixing a failing or flaky Playwright
  E2E test. Covers trace analysis, locator inspection, timing issues, and CI
  environment differences.
  Use this skill when a Playwright test is failing, timing out, or producing
  inconsistent results.
---

# Debug E2E Test

## When to Use

- A Playwright test that previously passed is now failing.
- A test fails intermittently (flaky).
- A test passes locally but fails in CI.
- A test times out without a clear reason.

## Process

1. **Read the error output** — run `npx playwright test <file> --reporter=list`
   and capture the full error message, the failing line, and the stack trace.

2. **Classify the failure type**:
   - `TimeoutError: locator.click` → element not found or not interactable.
   - `TimeoutError: expect(locator).toBeVisible` → assertion timeout; page
     state did not match expectation.
   - `AssertionError` → value mismatch; check test data and page state.
   - `TargetClosedError` → page navigated away or closed unexpectedly.
   - Flaky (no consistent error) → likely a race condition or network timing.

3. **Collect a trace** — if not already collected, enable tracing and re-run:
   ```bash
   npx playwright test <file> --trace=on
   npx playwright show-trace test-results/<test>/trace.zip
   ```
   In the trace viewer, check: screenshot timeline, network requests, and the
   action that failed.

4. **Reproduce in headed mode** — run with the Playwright Inspector to step
   through the test interactively:
   ```bash
   npx playwright test <file> --headed --debug
   ```
   Use `page.pause()` in the test to freeze execution at a specific point.

5. **Verify the locator** — open the Playwright Inspector (`--debug`) and use
   the pick locator tool to confirm the element exists and is uniquely
   identified. If the locator matches zero or multiple elements, fix it.

6. **Check for timing issues** — if the element exists but is not ready:
   - Add `await expect(locator).toBeVisible()` before the action.
   - Wait for a network response: `await page.waitForResponse('**/api/data')`.
   - Wait for navigation: `await page.waitForURL('**/expected-path')`.

7. **Investigate CI differences** — if the test only fails in CI:
   - Compare `baseURL`, viewport size, and browser version between local and CI.
   - Check for missing environment variables or `storageState` files.
   - Add `--retries=1` as a temporary diagnostic step; if retries pass, the
     issue is a race condition.

8. **Apply the fix** — make the smallest possible change. Prefer:
   - Improving the locator over restructuring the test.
   - An explicit `waitFor` assertion over `waitForTimeout`.
   - Fixing test data setup over adding retries.

9. **Verify the fix** — run the test five times in a row:
   ```bash
   for i in {1..5}; do npx playwright test <file>; done
   ```
   All five runs must pass before the fix is considered complete.

## Output Format

```
Root cause: <one sentence>

Failing locator:
  page.locator('.submit-btn')  ← ambiguous: matched 3 elements

Fixed locator:
  page.getByRole('button', { name: 'Place order' })  ← unique match

Why this works:
  The role-based locator is tied to the accessible name, which is stable
  across layout changes and unique within the checkout form.
```

## Best Practices

- Always read the trace before modifying the test — most failures are visible
  in the trace without running the test again.
- Do not add `test.slow()` or increase timeouts as a permanent fix; treat them
  as diagnostic tools only.
- If a test requires `retries: 2` to pass reliably, the test has a design flaw
  — find and fix the underlying race condition.
- Flaky tests in CI are often caused by missing `waitForLoadState('networkidle')`
  or a missing `waitForResponse` after a form submit.
- Keep a log of fixed flaky tests in a `FLAKY_TESTS.md` file to track patterns
  over time.
