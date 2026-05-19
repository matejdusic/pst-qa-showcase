import { Locator, Page } from '@playwright/test';

/**
 * Shared base for every page object.
 * Subclasses receive the Playwright Page and call super(page) to wire it up.
 * Exposes a `body` locator that any page can reuse (mock tests, sanity checks).
 *
 * Note: we deliberately do not expose a generic `waitForLoadState` helper.
 * `networkidle` hangs forever on the PST React SPA (long-polling), so each
 * page object waits for a specific element instead.
 */
export class BasePage {
  readonly body: Locator;

  constructor(protected readonly page: Page) {
    this.body = page.locator('body');
  }
}
