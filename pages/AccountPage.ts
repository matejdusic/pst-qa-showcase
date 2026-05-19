import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  readonly pageTitle: Locator;
  readonly favoritesCard: Locator;
  readonly profileCard: Locator;
  readonly invoicesCard: Locator;
  readonly messagesCard: Locator;
  readonly dashboardCards: Locator;
  readonly userMenuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="page-title"]');
    // /account dashboard surfaces four cards. The old "order-history" table is gone.
    this.favoritesCard = page.locator('a[href="/account/favorites"]');
    this.profileCard = page.locator('a[href="/account/profile"]');
    this.invoicesCard = page.locator('a[href="/account/invoices"]');
    this.messagesCard = page.locator('a[href="/account/messages"]');
    this.dashboardCards = page.locator('a[href^="/account/"]');
    // User menu — Sign out lives inside the "Jane Doe" dropdown.
    this.userMenuButton = page.locator('[data-test="nav-menu"]');
    this.logoutButton = page.locator('[data-test="nav-sign-out"]');
  }

  /** Backwards-compatible alias for tests that still reference `usernameHeading`. */
  get usernameHeading(): Locator {
    return this.pageTitle;
  }

  async goto(): Promise<void> {
    await this.page.goto('/account');
    await this.pageTitle.waitFor({ timeout: 15000 });
  }

  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutButton.click();
  }
}
