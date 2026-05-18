import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async dismissOverlays(): Promise<void> {
    try {
      await this.page
        .locator('[aria-label*="cookie"], [class*="consent"], button:has-text("Accept")')
        .first()
        .click({ timeout: 2000 });
    } catch {
      // no overlay present
    }
  }
}
