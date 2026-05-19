import { test, expect } from '../fixtures/pageFixtures';

test.describe('Auth — Authenticated Navigation', () => {
  test('TC-017: authenticated user accesses account page', async ({ accountPage, page }) => {
    await accountPage.goto();
    // Should not be redirected to login
    await expect(page).not.toHaveURL(/auth\/login/);
    await expect.soft(accountPage.usernameHeading).toBeVisible();
  });

  test('TC-018: logout redirects to home or login', async ({ accountPage, page }) => {
    await accountPage.goto();
    await accountPage.logout();
    await expect(page).toHaveURL(/\/(auth\/login|$)/);
  });
});
