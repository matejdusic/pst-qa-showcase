# PST QA Showcase — CLAUDE.md

## Project Overview

This project is an agency-grade E2E automation showcase targeting **https://practicesoftwaretesting.com** — a dedicated QA practice site for tools/hardware e-commerce flows. It demonstrates modern Playwright + TypeScript patterns used by Prototyp Digital: Page Object Model, fixture injection, authentication state reuse, API contract tests, visual regression, network mocking, and WCAG 2.0 accessibility audits.

**Tech stack:** Playwright 1.44+, TypeScript 5.4+, axe-core / @axe-core/playwright 4.9+, Node 20.

---

## Folder Structure

```
pst-qa-showcase/
├── pages/                  # Page Object Model classes — one per page/feature area
│   ├── BasePage.ts         # Shared base: constructor receives page, exposes dismissOverlays()
│   ├── HomePage.ts         # Catalogue, search, category filter, product navigation
│   ├── LoginPage.ts        # Login form interactions and error handling
│   ├── ProductPage.ts      # Product detail: title, price, add-to-cart, description
│   ├── CartPage.ts         # Cart: item list, quantity, remove, total
│   ├── CheckoutPage.ts     # Checkout form fields and order placement
│   └── AccountPage.ts      # Account: heading, order history, logout
│
├── fixtures/
│   └── pageFixtures.ts     # Extends Playwright base test with all page objects as typed fixtures
│
├── tests/                  # One .spec.ts file per feature/project area
│   ├── home.spec.ts        # TC-001–005: catalogue, search, filter, navigation, mobile
│   ├── product.spec.ts     # TC-006–009: product detail page
│   ├── cart.spec.ts        # TC-010–013: cart add/update/remove/total
│   ├── login.spec.ts       # TC-014–016: form render, invalid login, valid login
│   ├── auth.spec.ts        # TC-017–018: authenticated access, logout (needs storageState)
│   ├── account.spec.ts     # TC-019–020: profile info, order history (needs storageState)
│   ├── visual.spec.ts      # TC-021–023: screenshot regression (header, grid, cart)
│   ├── api.spec.ts         # TC-024–026: REST API contract tests via global fetch
│   ├── integration.spec.ts # TC-027–028: multi-step end-to-end user flows
│   ├── mock.spec.ts        # TC-029–030: network interception and route mocking
│   └── a11y.spec.ts        # TC-031–033: WCAG 2.0 axe-core critical violation checks
│
├── utils/
│   └── testHelpers.ts      # Shared helpers: navigateToProduct, waitForCatalogue, getCriticalViolations
│
├── auth.setup.ts           # Playwright setup project: logs in, writes playwright/.auth/user.json
├── playwright.config.ts    # All project definitions, baseURL, timeouts, reporter
├── package.json
├── tsconfig.json
├── .gitignore
└── .github/
    └── workflows/
        └── playwright.yml  # CI: 8 parallel jobs (one per project except setup)
```

---

## Playwright Projects

| Project        | testMatch                                      | Auth required | What it tests                                        |
|----------------|------------------------------------------------|---------------|------------------------------------------------------|
| `setup`        | `auth.setup.ts`                                | No            | Logs in, writes storageState to playwright/.auth/    |
| `anonymous`    | `tests/(home|product|cart|login).spec.ts`      | No            | Public-facing pages: catalogue, product, cart, login |
| `authenticated`| `tests/(auth|account).spec.ts`                 | Yes (setup)   | Protected routes: /account, logout                   |
| `mobile`       | `tests/home.spec.ts`                           | No            | Catalogue on Pixel 5 viewport                        |
| `visual`       | `tests/visual.spec.ts`                         | No            | Screenshot regression: header, grid, cart page       |
| `api`          | `tests/api.spec.ts`                            | No            | REST API schema and auth contract via fetch           |
| `integration`  | `tests/integration.spec.ts`                    | No            | Search→product→cart, login→account flows             |
| `mock`         | `tests/mock.spec.ts`                           | No            | Image blocking, API route fulfillment                 |
| `a11y`         | `tests/a11y.spec.ts`                           | No            | WCAG 2.0 axe-core critical violation audit            |

---

## Non-Negotiable Patterns

### 1. Locators live in page objects only — never in test files

Tests access the DOM exclusively through page object properties and methods. Raw `page.locator()` calls do not belong in `.spec.ts` files.

```ts
// Wrong
test('adds to cart', async ({ page }) => {
  await page.locator('[data-test="add-to-cart"]').click(); // raw selector in test
});

// Right
test('adds to cart', async ({ productPage }) => {
  await productPage.addToCart(); // page object method
});
```

### 2. Always import test and expect from fixtures, not from @playwright/test

```ts
// Always this in spec files
import { test, expect } from '../fixtures/pageFixtures';

// Never this in spec files
import { test, expect } from '@playwright/test';
```

Exception: `visual.spec.ts`, `api.spec.ts`, `mock.spec.ts`, and `a11y.spec.ts` import from `@playwright/test` directly because they do not use POM fixtures.

### 3. Locators are readonly properties declared in the constructor

```ts
export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('[data-test="product-name"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click(); // uses this.locator, never re-declares it
  }
}
```

### 4. Selector priority (most resilient first)

1. `getByRole()` — mirrors semantic HTML and screen readers
2. `getByText()` — for stable visible text
3. `getByLabel()` — for labelled form fields
4. `locator('[data-test="…"]')` — preferred for practicesoftwaretesting.com (site uses data-test attrs)
5. `locator('.class')` — last resort, brittle

### 5. expect.soft() for non-critical assertions

Use `expect.soft()` for checks that should not abort the test if they fail. Always end with at least one hard `expect()` that defines the pass/fail verdict.

```ts
await expect.soft(productPage.price).toBeVisible();        // non-critical check
await expect(productPage.productTitle).toBeVisible();       // critical — defines pass/fail
```

### 6. API tests use global fetch, no browser context

```ts
test('TC-024: product listing returns valid schema', async () => {
  // No { page } parameter — API tests run without a browser
  const res = await fetch(`${API_BASE}/products`, { headers: { Accept: 'application/json' } });
  expect(res.ok).toBe(true);
});
```

### 7. Accessibility tests only fail on critical violations

`getCriticalViolations()` in `utils/testHelpers.ts` filters axe results to `impact === 'critical'` only. Minor and moderate violations are logged to console but do not fail the test.

```ts
const criticalViolations = await getCriticalViolations(page);
expect(criticalViolations).toHaveLength(0);
```

---

## Test Credentials

| Role     | Email                                  | Password    |
|----------|----------------------------------------|-------------|
| Customer | customer@practicesoftwaretesting.com   | welcome01   |
| Admin    | admin@practicesoftwaretesting.com      | AKZUThph6   |

In CI, credentials are read from environment variables to avoid hardcoding secrets:

```ts
process.env.SITE_USERNAME || 'customer@practicesoftwaretesting.com'
process.env.SITE_PASSWORD || 'welcome01'
```

Set `SITE_USERNAME` and `SITE_PASSWORD` as GitHub Actions secrets on the repository. The `authenticated` job reads them automatically via the workflow env block.

---

## npm Scripts Reference

| Script                   | Description                                                         |
|--------------------------|---------------------------------------------------------------------|
| `test:anonymous`         | Run home, product, cart, login tests in Desktop Chrome              |
| `test:auth`              | Run setup (login) then auth + account tests with stored session     |
| `test:mobile`            | Run home tests on Pixel 5 viewport                                  |
| `test:visual`            | Run screenshot regression tests                                     |
| `test:visual:update`     | Regenerate all visual baseline snapshots                            |
| `test:api`               | Run REST API contract tests (no browser)                            |
| `test:integration`       | Run multi-step user flow tests                                      |
| `test:mock`              | Run network intercept / route mock tests                            |
| `test:a11y`              | Run WCAG 2.0 accessibility audit tests                              |
| `test:ui`                | Open Playwright UI mode for interactive debugging                   |
| `report`                 | Open the last HTML report in a browser                              |

---

## Adding New Tests

1. **Add locators to the relevant page object** in `pages/`. Declare them as `readonly` properties in the constructor. Do not put `page.locator()` calls in test files.

2. **Create a test file** in `tests/` following the naming convention `feature.spec.ts`. Assign the next sequential TC-NNN identifier.

3. **Import from fixtures** — always `import { test, expect } from '../fixtures/pageFixtures'` (unless the test has no POM dependencies).

4. **Add the test case to the Notion Test Cases database** with the TC-ID, description, project mapping, and status.

5. **Update `playwright.config.ts` testMatch** if the new file belongs to a new project or falls outside an existing pattern.

6. **Run the spec file locally** before committing:
   ```bash
   npx playwright test tests/your-spec.ts --project=anonymous
   ```

---

## Updating Visual Baselines

Run the following to regenerate all snapshot baselines:

```bash
npm run test:visual:update
```

This writes new PNG files into `tests/visual.spec.ts-snapshots/`. Commit the updated snapshot files alongside any UI changes that intentionally affect appearance. Never commit updated snapshots without reviewing the diffs visually first.

---

## Known Good Product IDs

`PRODUCT_ID = '01KRXJRPSQT6WT1J2VKCH86Y82'` is used across `product.spec.ts`, `cart.spec.ts`, and `a11y.spec.ts`. This is a stable product (Combination Pliers) confirmed to exist on practicesoftwaretesting.com.

To find other stable IDs, query the API directly:

```bash
curl "https://api.practicesoftwaretesting.com/api/products" \
  -H "Accept: application/json" | jq '.data[] | {id, name}'
```

Use the `id` field from the response as the product ID in `page.goto('/product/<id>')`.
