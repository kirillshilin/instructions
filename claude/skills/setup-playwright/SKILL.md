---
name: setup-playwright
description: >
  End-to-end workflow for installing and configuring Playwright in a project,
  including TypeScript setup, folder structure, base fixtures, and a working
  example test.
  Use this skill when adding Playwright to a project for the first time or
  when bootstrapping a new E2E test suite from scratch.
---

# Setup Playwright

## When to Use

- Adding Playwright to an existing project with no E2E tests.
- Bootstrapping a new standalone E2E test project.
- Resetting or standardising an existing Playwright configuration.

## Process

1. **Install Playwright** — run the official initialiser in the project root:
   ```bash
   npm init playwright@latest
   ```
   When prompted:
   - Language: **TypeScript**
   - Test directory: `tests`
   - GitHub Actions: **Yes** (adds `.github/workflows/playwright.yml`)
   - Install browsers: **Yes**

2. **Verify the install** — run the generated example test:
   ```bash
   npx playwright test
   ```
   All example tests should pass before proceeding.

3. **Configure `playwright.config.ts`** — update the generated config:
   ```typescript
   import { defineConfig, devices } from '@playwright/test';

   export default defineConfig({
     testDir: './tests',
     fullyParallel: true,
     forbidOnly: !!process.env.CI,
     retries: process.env.CI ? 2 : 0,
     workers: process.env.CI ? 1 : undefined,
     reporter: [['html'], ['list']],
     use: {
       baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
       trace: 'on-first-retry',
       screenshot: 'only-on-failure',
       video: 'retain-on-failure',
     },
     projects: [
       { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
       { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
       { name: 'webkit', use: { ...devices['Desktop Safari'] } },
     ],
   });
   ```

4. **Create the folder structure**:
   ```
   tests/
     fixtures.ts
     pages/
       BasePage.ts
     helpers/
   ```

5. **Create `tests/fixtures.ts`** — extend the base `test` object so all
   spec files import from a single entry point:
   ```typescript
   import { test as base, expect } from '@playwright/test';

   export const test = base.extend({
     // Add shared fixtures here (e.g., authenticated page, API client)
   });

   export { expect };
   ```

6. **Create `tests/pages/BasePage.ts`**:
   ```typescript
   import { Page } from '@playwright/test';

   export abstract class BasePage {
     constructor(protected page: Page) {}

     async waitForPageLoad() {
       await this.page.waitForLoadState('domcontentloaded');
     }
   }
   ```

7. **Add `.env.example`** — document required environment variables:
   ```
   BASE_URL=http://localhost:3000
   ```

8. **Update `.gitignore`** — ensure test artifacts are excluded:
   ```
   /test-results/
   /playwright-report/
   /blob-report/
   /playwright/.cache/
   ```

9. **Run the full suite** — confirm everything works:
   ```bash
   npx playwright test --project=chromium
   ```

## Output Format

After setup, report:
```
✅ Playwright installed: <version>
✅ Browsers installed: chromium, firefox, webkit
✅ Config: playwright.config.ts
✅ Folder structure: tests/fixtures.ts, tests/pages/BasePage.ts
✅ CI workflow: .github/workflows/playwright.yml
✅ Example test run: X passed
```

## Best Practices

- Always set `baseURL` via an environment variable — never hardcode a URL in
  `playwright.config.ts` or test files.
- Enable `fullyParallel: true` from the start; retrofitting parallelism into
  a sequential suite is much harder.
- Commit the lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`)
  after install so CI uses identical browser versions.
- Run `npx playwright install --with-deps` in CI to install system
  dependencies alongside browser binaries.
- Keep `retries: 0` in local development to surface flaky tests immediately;
  set `retries: 2` only in CI.
