import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart page — note: PST has merged the cart UI into the /checkout route.
 * There is no `/cart` path anymore (it redirects to `/`). The cart is the
 * first table on /checkout, with login/guest checkout forms below it.
 */
export class CartPage extends BasePage {
  /** Cart-quantity badge in the navbar — single source of truth for "how many items?". */
  readonly cartBadge: Locator;
  /** One span per cart row holding the product name. */
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly quantityInputs: Locator;
  /** Red "X" remove button on each cart row (no data-test on the site). */
  readonly deleteButtons: Locator;
  readonly proceedButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge = page.locator('[data-test="cart-quantity"]');
    this.cartItems = page.locator('[data-test="product-title"]');
    this.totalPrice = page.locator('[data-test="cart-total"]');
    this.quantityInputs = page.locator('[data-test="product-quantity"]');
    this.deleteButtons = page.locator('a.btn.btn-danger');
    this.proceedButton = page.locator('[data-test="proceed-1"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout', { waitUntil: 'domcontentloaded' });
    // Cart UI hydrates after the Angular router resolves. Either the cart
    // shows real items or the cart-total row renders with $0.
    await Promise.race([
      this.totalPrice.waitFor({ timeout: 10000 }),
      this.cartItems.first().waitFor({ timeout: 10000 }),
    ]).catch(() => null);
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async updateQuantity(index: number, quantity: number): Promise<void> {
    const input = this.quantityInputs.nth(index);
    await input.fill(String(quantity));
    await input.press('Enter');
  }

  async removeItem(index: number): Promise<void> {
    const before = await this.cartItems.count();
    await this.deleteButtons.nth(index).click();
    await this.page.waitForFunction(
      (n) => document.querySelectorAll('[data-test="product-title"]').length < n,
      before,
      { timeout: 10000 }
    );
  }
}
