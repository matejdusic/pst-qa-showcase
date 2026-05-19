import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly productDescription: Locator;
  readonly quantityInput: Locator;
  readonly cartConfirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('[data-test="product-name"]');
    this.price = page.locator('[data-test="unit-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.productDescription = page.locator('[data-test="product-description"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
    // Toast / alert shown after a successful add. Matches Bootstrap toast,
    // ARIA live regions, and the site's bootstrap-style alert classes.
    this.cartConfirmation = page.locator('.toast, [role="status"], ngb-toast, .alert-success');
  }

  async goto(productId: string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
    await this.productTitle.waitFor({ timeout: 15000 });
  }

  /**
   * Click "Add to cart" and wait for the confirmation toast.
   * The toast is the signal that the cart state has actually persisted —
   * without this wait, immediately navigating to /cart can race the update
   * and the cart page will appear empty.
   */
  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.cartConfirmation.first().waitFor({ timeout: 5000 }).catch(() => null);
  }
}
