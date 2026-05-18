import { test, expect } from '../fixtures/pageFixtures';

test.describe('Integration Flows', () => {
  test('TC-027: search → product → cart flow', async ({ homePage, productPage, cartPage }) => {
    await homePage.goto();
    await homePage.search('Pliers');
    await homePage.waitForProducts();
    await homePage.productCards.first().click();
    await homePage.waitForLoadState();
    await productPage.addToCart();
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-028: login → account navigation flow', async ({ loginPage, accountPage, page }) => {
    await loginPage.goto();
    await loginPage.login(
      'customer@practicesoftwaretesting.com',
      'welcome01'
    );
    await page.waitForURL(/\/(account|dashboard)/, { timeout: 15000 });
    await expect(page).not.toHaveURL(/auth\/login/);
    await expect.soft(accountPage.usernameHeading).toBeVisible();
  });
});
