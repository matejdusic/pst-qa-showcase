import { test, expect } from '../fixtures/pageFixtures';

test.describe('Integration Flows', () => {
  test('TC-027: search → product → cart flow', async ({ homePage, productPage, cartPage }) => {
    await homePage.goto();
    await homePage.search('Pliers');
    await homePage.waitForProducts();
    await homePage.clickFirstProduct();
    // Wait for the product detail to render before clicking add-to-cart
    await expect(productPage.productTitle).toBeVisible({ timeout: 15000 });
    await productPage.addToCart();
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-028: login → account navigation flow', async ({ loginPage, accountPage, page }) => {
    await loginPage.goto();
    await loginPage.loginAndWait(
      process.env.SITE_USERNAME || 'customer2@practicesoftwaretesting.com',
      process.env.SITE_PASSWORD || 'welcome01'
    );
    await expect(page).not.toHaveURL(/auth\/login/);
    // Wait for the account page to render, then assert the heading.
    await expect(accountPage.pageTitle).toBeVisible({ timeout: 15000 });
  });
});
