# pst-qa-showcase

Agency-grade Playwright + TypeScript automation showcase for [practicesoftwaretesting.com](https://practicesoftwaretesting.com) — a dedicated QA practice e-commerce site for hand tools and hardware. The suite covers UI, API, integration, visual regression, network mocking, and WCAG 2.0 accessibility across 33 test cases and 8 parallel CI jobs.

Built as a demonstration of how Claude + Cowork can scaffold and iterate on a production-quality test suite the way an agency QA engineer would.

---

## Project structure

```
pages/           Page Object classes — one per page/feature
fixtures/        Extends Playwright's test with all page objects
tests/           Test specs — one file per feature area
utils/           Shared helpers (addProductToCart, getCriticalViolations)
auth.setup.ts    Setup project — logs in once, saves storageState
playwright.config.ts
.github/workflows/playwright.yml  CI: 8 parallel jobs
```

The separation between `pages/` and `tests/` is the point. When a selector breaks, you fix it in the page object — not in every test that touches it.

---

## Running tests

```bash
npm ci
npx playwright install chromium --with-deps

npm run test:anonymous       # home, product, cart, login (Desktop Chrome)
npm run test:auth            # setup → authenticated specs with saved session
npm run test:mobile          # home spec on Pixel 5 viewport
npm run test:api             # REST contract tests (no browser)
npm run test:integration     # multi-step end-to-end flows
npm run test:visual          # screenshot regression (macOS baselines)
npm run test:visual:update   # regenerate baselines
npm run test:mock            # network interception / route mocking
npm run test:a11y            # WCAG 2.0 axe-core audit
npm run test:ui              # Playwright UI mode for debugging
npm run report               # open the last HTML report
```

Single file:

```bash
npx playwright test tests/home.spec.ts --project=anonymous
```

---

## Core concepts

**Page Object Model** — every page is a class extending `BasePage`. Locators are declared as `readonly` properties in the constructor; action methods (`login()`, `addToCart()`, `updateQuantity()`) use those locators. Tests never call `page.locator()` directly — everything goes through the page object.

**Fixtures** — always import `test` and `expect` from `fixtures/pageFixtures`, not from `@playwright/test`. The fixture wires every page object up as a typed test parameter automatically. The only exception is `api.spec.ts`, which runs without a browser.

**Selector priority** — `getByRole` → `getByText` → `getByLabel` → `locator('[data-test="…"]')` → `locator('.class')`. practicesoftwaretesting.com ships first-class `data-test` attributes, so most locators land on the fourth tier — stable, readable, and immune to CSS churn.

**storageState** — the `setup` project (`auth.setup.ts`) logs in once via `LoginPage`, then saves the browser session to `playwright/.auth/user.json`. The `authenticated` project loads that file before each test, skipping the login round-trip. The auth dir is gitignored — it gets regenerated on every CI run from secrets.

**Soft vs. hard assertions** — `expect.soft()` keeps the test running on failure (good for "check all these things exist" sweeps); a final `expect()` defines the verdict. Every test ends with at least one hard assertion.

**Integration tests** — chain user flows across multiple pages and page objects: search → product → cart, login → account. The page objects compose naturally; no helper proliferation required.

**API tests** — the `api` project bypasses the browser entirely and uses Node's global `fetch` to verify the REST contract: product listing schema, search results, login token issuance.

**Mock data** — `page.route(url, handler)` intercepts a request before it leaves the browser and serves local JSON or aborts entirely. Used to verify the UI handles missing images and to assert page render resilience under stubbed APIs.

**Visual regression** — `expect.toHaveScreenshot()` compares the named region against a committed baseline. Baselines are macOS-specific, so CI uses `test:visual:ci` which adds `--ignore-snapshots`. Run `npm run test:visual:update` locally on your Mac to refresh.

**Accessibility** — `@axe-core/playwright` runs a WCAG 2.0 A/AA audit on the homepage, product page, and login page. `getCriticalViolations()` in `utils/` filters to `impact === 'critical'` — minor and moderate violations are logged but never fail the test.

---

## Auth

Credentials live in env vars locally and as GitHub Actions secrets in CI:

| Variable        | Value (example)                          |
|-----------------|------------------------------------------|
| `SITE_USERNAME` | `customer@practicesoftwaretesting.com`   |
| `SITE_PASSWORD` | `welcome01`                              |

`auth.setup.ts` and any spec that needs to authenticate read these via `process.env.SITE_USERNAME || '…default…'`. The default falls back to the public practice credentials, which are safe to commit.

In CI, the `authenticated` job (`.github/workflows/playwright.yml`) only runs on push to `main` and reads the secrets via the workflow `env:` block.

---

## CI

GitHub Actions runs **eight parallel jobs** on every push and pull request:

| Job             | What it runs                                                     |
|-----------------|------------------------------------------------------------------|
| `anonymous`     | home, product, cart, login specs                                 |
| `api`           | REST contract tests                                              |
| `mobile`        | home spec on Pixel 5                                             |
| `visual`        | visual specs with `--ignore-snapshots` (Linux ≠ macOS baselines) |
| `integration`   | multi-step flows                                                 |
| `mock`          | network interception / route mocking                             |
| `a11y`          | WCAG 2.0 axe audit                                               |
| `authenticated` | setup + auth/account specs (push-to-main only, reads secrets)    |

Each job uploads its HTML report as an artifact (`playwright-report-<job>`, 14-day retention) so failures are inspectable without re-running.

---

## Adding a test

1. Add any new locators as `readonly` properties on the relevant page object in `pages/`. No raw `page.locator()` in specs.
2. Create `tests/<feature>.spec.ts`. Assign the next sequential TC-NNN identifier.
3. Import `{ test, expect }` from `../fixtures/pageFixtures` (unless the spec runs without a browser).
4. Update `playwright.config.ts` if the new file needs to belong to a new project.
5. Mirror the case in the Notion Test Cases database.

See `CLAUDE.md` for the full project rule set and patterns.
