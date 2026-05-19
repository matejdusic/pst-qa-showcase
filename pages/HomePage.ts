import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly header: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly firstProductCard: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly pageHeading: Locator;
  readonly categoryLinks: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.locator('nav, header').first();
    this.productGrid = page.locator('.col-md-9, [class*="products"], main').first();
    this.productCards = page.locator('[data-test="product-name"]');
    this.firstProductCard = this.productCards.first();
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.pageHeading = page.getByRole('heading', { level: 1 });
    this.categoryLinks = page.locator('[data-test^="nav-"]');
    this.pagination = page.locator('[data-test="pagination"]');
  }

  /** Returns a locator for a category nav link by its readable name. */
  categoryLink(name: string): Locator {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return this.page.locator(`[data-test="nav-${slug}"]`);
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
    await this.categoryLink(name).click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickFirstProduct(): Promise<void> {
    await this.firstProductCard.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForProducts(): Promise<void> {
    await this.firstProductCard.waitFor({ timeout: 15000 });
  }
}
