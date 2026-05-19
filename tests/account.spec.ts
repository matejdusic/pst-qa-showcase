import { test, expect } from '../fixtures/pageFixtures';

test.describe('Account', () => {
  test('TC-019: profile page displays user info', async ({ accountPage }) => {
    await accountPage.goto();
    await expect(accountPage.usernameHeading).toBeVisible();
    const text = await accountPage.usernameHeading.textContent();
    expect(text?.trim().length ?? 0).toBeGreaterThan(0);
  });

  test('TC-020: order history section is visible', async ({ accountPage }) => {
    await accountPage.goto();
    await expect.soft(accountPage.orderHistoryTable).toBeVisible();
  });
});
