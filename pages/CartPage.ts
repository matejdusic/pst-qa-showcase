import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly proceedButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly quantityInputs: Locator;
  readonly deleteButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="cart-item"]');
    this.totalPrice = page.locator('[data-test="cart-total"]');
    this.proceedButton = page.locator('[data-test="proceed-1"]');
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
    this.quantityInputs = page.locator('[data-test="product-quantity"]');
    this.deleteButtons = page.locator('[data-test="delete-product"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart');
    await this.page.waitForLoadState('networkidle');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async updateQuantity(index: number, quantity: number): Promise<void> {
    const input = this.quantityInputs.nth(index);
    await input.fill(String(quantity));
    await input.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async removeItem(index: number): Promise<void> {
    await this.deleteButtons.nth(index).click();
    await this.page.waitForLoadState('networkidle');
  }
}
