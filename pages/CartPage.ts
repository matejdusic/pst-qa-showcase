import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly proceedButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly quantityInputs: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('[data-test="page-title"]');
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.totalPrice = page.locator('[data-test="cart-total"]');
    this.proceedButton = page.locator('[data-test="proceed-1"]');
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
    this.quantityInputs = page.locator('[data-test="product-quantity"]');
    this.deleteButtons = page.locator('[data-test="delete-product"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
    // Wait for the cart page chrome to render. Either the page title appears
    // or the cart-empty / items state. Whichever lands first.
    await Promise.race([
      this.pageTitle.waitFor({ timeout: 10000 }),
      this.cartItems.first().waitFor({ timeout: 10000 }),
      this.emptyCartMessage.waitFor({ timeout: 10000 }),
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
    // Cart updates client-side; wait for the row to actually disappear
    // rather than a generic network signal.
    await this.page.waitForFunction(
      (n) => document.querySelectorAll('[data-test="cart-item"]').length < n,
      before,
      { timeout: 10000 }
    );
  }
}
