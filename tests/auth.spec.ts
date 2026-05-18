import { test, expect } from '../fixtures/pageFixtures';

test.describe('Auth — Authenticated Navigation', () => {
  test('TC-017: authenticated user accesses account page', async ({ page }) => {
    await page.goto('/account');
    await page.waitForLoadState('networkidle');
    // Should not be redirected to login
    await expect(page).not.toHaveURL(/auth\/login/);
  });

  test('TC-018: logout redirects to home or login', async ({ accountPage, page }) => {
    await accountPage.goto();
    await accountPage.logoutButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/(auth\/login|$)/);
  });
});
