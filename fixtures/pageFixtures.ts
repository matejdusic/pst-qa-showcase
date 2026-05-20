import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { AccountPage } from '../pages/AccountPage';

type PageFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  accountPage: AccountPage;
};

type WorkerFixtures = {
  /**
   * A live, valid product ID fetched from the PST API once per worker.
   * The seeded products on practicesoftwaretesting.com rotate when the
   * database is rebuilt, so hardcoding an ID makes the suite flaky. Tests
   * that need a specific product use this fixture instead.
   */
  productId: string;
};

const PRODUCTS_API = 'https://api.practicesoftwaretesting.com/products';

export const test = base.extend<PageFixtures, WorkerFixtures>({
  productId: [
    async ({}, use) => {
      const res = await fetch(PRODUCTS_API, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        throw new Error(`Failed to fetch products from ${PRODUCTS_API}: ${res.status}`);
      }
      const data = (await res.json()) as { data?: Array<{ id: string }> };
      const id = data.data?.[0]?.id;
      if (!id) {
        throw new Error(`No products returned from ${PRODUCTS_API}`);
      }
      await use(id);
    },
    { scope: 'worker' },
  ],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
});

export { expect } from '@playwright/test';
