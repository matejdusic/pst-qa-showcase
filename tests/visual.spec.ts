import { test, expect } from '../fixtures/pageFixtures';

test.describe('Visual Regression', () => {
  test('TC-021: header snapshot', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    await expect(homePage.header).toHaveScreenshot('header.png');
  });

  test('TC-022: product grid snapshot', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    await expect(homePage.productGrid).toHaveScreenshot('product-grid.png');
  });

  test('TC-023: cart page snapshot (with added item)', async ({ homePage, productPage, cartPage }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    await homePage.clickFirstProduct();
    await productPage.addToCart();
    await cartPage.goto();
    await expect(cartPage.body).toHaveScreenshot('cart-page.png');
  });
});
