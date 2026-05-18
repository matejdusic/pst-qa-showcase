import { test, expect } from '../fixtures/pageFixtures';

test.describe('Account', () => {
  test('TC-019: profile page displays user info', async ({ accountPage, page }) => {
    await accountPage.goto();
    await expect(accountPage.usernameHeading).toBeVisible();
    const text = await accountPage.usernameHeading.textContent();
    expect(text).toBeTruthy();
  });

  test('TC-020: order history section is visible', async ({ accountPage }) => {
    await accountPage.goto();
    await expect.soft(accountPage.orderHistoryTable).toBeVisible();
  });
});
