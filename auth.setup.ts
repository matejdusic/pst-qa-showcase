import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { LoginPage } from './pages/LoginPage';

/**
 * Playwright setup project — runs once before any test that depends on it.
 * Logs in with the customer credentials and saves the storageState to
 * playwright/.auth/user.json. The `authenticated` project then loads that
 * file so every test starts already signed in.
 */
const authFile = path.join(__dirname, 'playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAndWait(
    process.env.SITE_USERNAME || 'customer@practicesoftwaretesting.com',
    process.env.SITE_PASSWORD || 'welcome01'
  );
  await page.context().storageState({ path: authFile });
});
