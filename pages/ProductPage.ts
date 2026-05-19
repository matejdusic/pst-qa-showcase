import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly productDescription: Locator;
  readonly quantityInput: Locator;

  constructor(page: Page) {
    super(page);
    this.productTitle = page.locator('[data-test="product-name"]');
    this.price = page.locator('[data-test="unit-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.productDescription = page.locator('[data-test="product-description"]');
    this.quantityInput = page.locator('[data-test="quantity"]');
  }

  async goto(productId: string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
    await this.productTitle.waitFor({ timeout: 15000 });
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
