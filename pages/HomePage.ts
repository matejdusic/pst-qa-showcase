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
   * Open the mobile hamburger menu (navbar collapse) if needed.
   *
   * Note: the search input is NOT inside the navbar — it lives in `#filters`,
   * a separate Bootstrap collapse that the site only shows on `md+` viewports
   * (≥768px). There is no mobile toggle for the search/filters sidebar, so
   * search is effectively desktop-only on PST. This helper only opens the
   * navbar (Home / Categories / Contact / Sign in) and uses `nav-categories`
   * as the visibility signal — clicking the toggle while waiting on the
   * search input would never succeed on mobile.
   *
   * Bootstrap's collapse JS occasionally misses the click on Pixel 5
   * emulation; if the navbar hasn't expanded within 2s we add `.show`
   * directly to `#navbarSupportedContent`.
   */
  async openMobileNavbarIfNeeded(): Promise<void> {
    const viewport = this.page.viewportSize();
    if (!viewport || viewport.width >= 992) return;
    await this.mobileNavToggle.waitFor({ state: 'visible', timeout: 5000 });
    await this.mobileNavToggle.click();
    try {
      await this.categoriesNavButton.waitFor({ state: 'visible', timeout: 2000 });
    } catch {
      await this.page.evaluate(() => {
        document.querySelector('#navbarSupportedContent')?.classList.add('show');
      });
      await this.categoriesNavButton.waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  /** Returns true when the search input is present and visible. PST hides it on mobile. */
  async isSearchAvailable(): Promise<boolean> {
    return this.searchInput.isVisible();
  }

  async search(term: string): Promise<void> {
    // Search is in #filters (desktop-only). No mobile toggle exists on PST,
    // so callers should guard with isSearchAvailable() on mobile viewports.
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  async filterByCategory(name: string): Promise<void> {
    await this.openMobileNavbarIfNeeded();
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
