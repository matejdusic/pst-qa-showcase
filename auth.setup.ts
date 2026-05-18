import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, 'playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Ensure the auth directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');

  await page.locator('[data-test="email"]').fill(
    process.env.SITE_USERNAME || 'customer@practicesoftwaretesting.com'
  );
  await page.locator('[data-test="password"]').fill(
    process.env.SITE_PASSWORD || 'welcome01'
  );
  await page.locator('[data-test="login-submit"]').click();

  // Wait for successful login redirect
  await page.waitForURL(/\/(account|dashboard)/, { timeout: 15000 });
  await page.context().storageState({ path: authFile });
});
