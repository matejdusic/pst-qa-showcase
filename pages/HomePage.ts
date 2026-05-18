import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly pageHeading: Locator;
  readonly categoryLinks: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('[data-test="product-name"]');
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.pageHeading = page.getByRole('heading', { level: 1 });
    this.categoryLinks = page.locator('[data-test^="nav-"]');
    this.pagination = page.locator('[data-test="pagination"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(name: string): Promise<void> {
    await this.page.locator(`[data-test="nav-${name.toLowerCase().replace(/\s+/g, '-')}"]`).click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickFirstProduct(): Promise<void> {
    await this.productCards.first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForProducts(): Promise<void> {
    await this.productCards.first().waitFor({ timeout: 15000 });
  }
}
