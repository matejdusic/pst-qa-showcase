import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countrySelect: Locator;
  readonly postcodeInput: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.addressInput = page.locator('[data-test="address"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postcodeInput = page.locator('[data-test="postcode"]');
    this.placeOrderButton = page.locator('[data-test="finish"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout');
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
