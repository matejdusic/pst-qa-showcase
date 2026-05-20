import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly header: Locator;
  readonly mobileNavToggle: Locator;
  readonly productGrid: Locator;
  readonly productCards: Locator;
  readonly firstProductCard: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly pageHeading: Locator;
  readonly categoriesNavButton: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.locator('nav, header').first();
    // Hamburger toggle exposed on mobile viewports; no data-test attr on the site.
    this.mobileNavToggle = page.locator('.navbar-toggler');
    this.productGrid = page.locator('.col-md-9, [class*="products"], main').first();
    this.productCards = page.locator('[data-test="product-name"]');
    this.firstProductCard = this.productCards.first();
    this.searchInput = page.locator('[data-test="search-query"]');
    this.searchButton = page.locator('[data-test="search-submit"]');
    this.pageHeading = page.getByRole('heading', { level: 1 });
    // The "Categories" parent button — must be clicked before category items become visible.
    this.categoriesNavButton = page.locator('[data-test="nav-categories"]');
    this.pagination = page.locator('[data-test="pagination"]');
  }

  /** Returns a locator for a category nav link by its readable name (e.g. "hand-tools"). */
  categoryLink(name: string): Locator {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    return this.page.locator(`[data-test="nav-${slug}"]`);
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Open the mobile hamburger menu if the navbar is currently collapsed.
   *
   * Detection is viewport-based: Bootstrap collapses the navbar below the `lg`
   * breakpoint (992px). On desktop the toggle button is hidden via CSS, so
   * checking `searchInput.isVisible()` was unreliable — during hydration the
   * input can briefly report hidden on desktop and we'd try to click a
   * permanently-hidden toggle. Viewport width is stable and never lies.
   */
  async openMobileNavIfNeeded(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (!viewport || viewport.width >= 992) return;
    await this.mobileNavToggle.waitFor({ state: 'visible', timeout: 5000 });
    await this.mobileNavToggle.click();
    await this.searchInput.waitFor({ state: 'visible', timeout: 5000 });
  }

  async search(term: string): Promise<void> {
    await this.openMobileNavIfNeeded();
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async filterByCategory(name: string): Promise<void> {
    await this.openMobileNavIfNeeded();
    // The Categories menu is a dropdown — open it before its items become clickable.
    await this.categoriesNavButton.click();
    await this.categoryLink(name).click();
  }

  async clickFirstProduct(): Promise<void> {
    await this.firstProductCard.click();
  }

  /**
   * Wait until at least one product card is rendered. Use this instead of
   * waitForLoadState('networkidle') — the PST React SPA holds open polling
   * connections, so networkidle never resolves.
   */
  async waitForProducts(): Promise<void> {
    await this.firstProductCard.waitFor({ timeout: 15000 });
  }
}
