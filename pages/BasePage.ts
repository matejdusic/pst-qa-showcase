import { Locator, Page } from '@playwright/test';

/**
 * Shared base for every page object.
 * Subclasses receive the Playwright Page and call super(page) to wire it up.
 * Declared as a class (not just a type) so subclasses can extend it and inherit
 * shared helpers and the universal `body` locator.
 */
export class BasePage {
  readonly body: Locator;

  constructor(protected readonly page: Page) {
    this.body = page.locator('body');
  }

  /** Wait for network idle — useful after navigations or actions that trigger XHRs. */
  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
