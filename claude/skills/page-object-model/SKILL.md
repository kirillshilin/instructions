---
name: page-object-model
description: >
  Workflow for creating and structuring Page Object Model (POM) classes for
  Playwright tests. Produces well-encapsulated page objects with typed methods,
  stable locators, and consistent naming.
  Use this skill when creating a new page object, refactoring raw locators out
  of spec files, or designing a page-object hierarchy for a new feature area.
---

# Page Object Model

## When to Use

- A spec file contains raw locators that should be moved to a page object.
- A new page or component needs a corresponding page-object class.
- Multiple spec files duplicate the same interaction logic.
- The page-object hierarchy needs to be redesigned for a new feature area.

## Process

1. **Identify the page or component** — determine which URL or UI component
   the page object will represent. One class per distinct page or major
   component (modal, form, navigation bar).

2. **List the interactions** — enumerate every user action the tests will
   perform on this page: navigate, fill fields, click buttons, select options,
   read values. Each action becomes one method.

3. **Choose locators** — for each interactive element, select the most
   resilient locator in this order:
   - `getByRole('button', { name: '…' })` — tied to accessible role and name.
   - `getByLabel('…')` — stable for form inputs.
   - `getByTestId('…')` — stable, requires `data-testid` attribute in HTML.
   - `getByText('…', { exact: true })` — for static, unique text content.
   - CSS selector — last resort only; document why it was necessary.

4. **Create the class file** — name the file `<PageName>.page.ts` in
   `tests/pages/`. Follow this structure:
   - Extend `BasePage` if a base class exists.
   - Constructor accepts `page: Page`.
   - Locators as private getters (not properties) so they re-query on access.
   - One `async` method per user action; methods return `void` or a meaningful
     value, never `Locator`.
   - A `goto()` method for navigatable pages.

5. **Migrate spec files** — replace any raw locators in spec files with calls
   to the new page object. Spec files must not import `Page` directly for
   locator operations after the migration.

6. **Run affected tests** — execute all spec files that use the page object
   and confirm they still pass: `npx playwright test --project=chromium`.

## Output Format

```typescript
// tests/pages/LoginPage.page.ts
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/login');
  }

  private get emailInput() {
    return this.page.getByLabel('Email address');
  }

  private get passwordInput() {
    return this.page.getByLabel('Password');
  }

  private get submitButton() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  private get errorMessage() {
    return this.page.getByRole('alert');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toHaveText(message);
  }
}
```

## Best Practices

- **Getters, not properties** — define locators as `get email()` rather than
  `this.email = this.page.getByLabel(…)`. Getters re-query the DOM each time,
  which is safer after navigation or re-renders.
- **No assertions in page objects** (with one exception) — keep assertions in
  spec files. The only exception is a dedicated `expectXxx()` helper method
  on the page object for complex, reusable assertions.
- **Keep methods thin** — a method should do one thing. A user action that
  naturally triggers navigation (e.g., clicking Submit) is fine as a single
  method. What to avoid is combining two unrelated actions: prefer separate
  `login()` and `navigateToDashboard()` over `loginAndNavigateToDashboard()`.
- **Type the return value** — methods that read a value (e.g., get heading
  text) should return `Promise<string>` rather than `Promise<Locator>`.
- **One class per page** — do not put multiple pages in a single file. If a
  page has large sections (e.g., a complex form), create a sub-class or a
  separate component object and compose them.
- **Name methods after actions** — use verbs: `fill`, `submit`, `select`,
  `open`, `close`, `expect`. Avoid vague names like `handle` or `process`.
