import { test, expect } from '../fixtures/pageFixtures';

test.describe('Login', () => {
  test('TC-014: login form renders correctly', async ({ loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('TC-015: invalid credentials show error message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('TC-016: valid credentials redirect to account', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(
      'customer@practicesoftwaretesting.com',
      'welcome01'
    );
    await expect(page).toHaveURL(/\/(account|dashboard)/, { timeout: 15000 });
  });
});
