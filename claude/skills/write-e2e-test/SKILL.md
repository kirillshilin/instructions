---
name: write-e2e-test
description: >
  Step-by-step workflow for writing a new Playwright E2E test for a given user
  journey or acceptance criterion. Produces a page-object update and a spec
  file following the project's conventions.
  Use this skill when asked to write, add, or generate a Playwright E2E test.
---

# Write E2E Test

## When to Use

- A new feature needs E2E test coverage.
- An existing test needs to be extended with additional scenarios.
- A bug fix requires a regression test.

## Process

1. **Clarify the scenario** — confirm the user journey to test: entry point
   (URL), actions to perform, and the expected outcome to assert.

2. **Read existing tests** — scan `tests/` for similar spec files and page
   objects to understand naming conventions, locator strategy, and fixture use.

3. **Identify or create the page object** — check `tests/pages/` for an
   existing page class that covers the target page. If none exists, create
   `tests/pages/<PageName>.page.ts` with:
   - A constructor accepting `page: Page`.
   - A `goto()` method navigating to the page URL.
   - One method per distinct user action (click, fill, submit).
   - Locator properties as private getters using `getByRole`, `getByLabel`, or
     `getByTestId` — no raw CSS strings outside the page object.

4. **Write the spec file** — create or update `tests/<feature>/<name>.spec.ts`:
   - Import from `tests/fixtures.ts` (not directly from `@playwright/test`).
   - Wrap related tests in `test.describe('<Feature> — <Page>')`.
   - One `test()` block per scenario with a plain-English description.
   - Follow Arrange → Act → Assert structure with a blank line between sections.
   - Use `expect` assertions from `@playwright/test`; prefer `toBeVisible`,
     `toHaveText`, `toHaveURL` over generic truthy checks.

5. **Run the test** — execute `npx playwright test <file> --project=chromium`
   and confirm it passes.

6. **Cross-browser check** — run `npx playwright test <file>` (all projects)
   and fix any browser-specific failures.

7. **Report** — summarise: spec file path, page object changes, and a one-line
   description of what each test asserts.

## Output Format

```typescript
// tests/pages/CheckoutPage.page.ts
import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/checkout');
  }

  private get emailInput() {
    return this.page.getByLabel('Email address');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }
}
```

```typescript
// tests/checkout/checkout.spec.ts
import { test, expect } from '../fixtures';
import { CheckoutPage } from '../pages/CheckoutPage.page';

test.describe('Checkout — order submission', () => {
  test('shows confirmation after successful order', async ({ page }) => {
    const checkout = new CheckoutPage(page);

    await checkout.goto();
    await checkout.fillEmail('user@example.com');
    await checkout.submit();

    await expect(page).toHaveURL('/order-confirmation');
    await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible();
  });
});
```

## Best Practices

- Never put raw locators (CSS, XPath) directly in spec files.
- Avoid `page.waitForTimeout` — use `waitFor` conditions or Playwright's
  auto-waiting assertions.
- Keep each `test()` independent; do not rely on state left by a previous test.
- Prefer `getByRole` with an accessible name over `getByTestId` where the UI
  exposes a meaningful role.
- If the test needs authentication, use `storageState` configured in
  `playwright.config.ts` rather than logging in inside the test.
