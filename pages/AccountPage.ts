import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  readonly usernameHeading: Locator;
  readonly orderHistoryTable: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameHeading = page.locator('[data-test="page-title"]');
    this.orderHistoryTable = page.locator('[data-test="order-history"]');
    this.logoutButton = page.locator('[data-test="nav-sign-out"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/account');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
