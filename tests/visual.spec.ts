import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('TC-021: header snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-test="product-name"]', { timeout: 15000 });
    const header = page.locator('nav, header').first();
    await expect(header).toHaveScreenshot('header.png');
  });

  test('TC-022: product grid snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-test="product-name"]', { timeout: 15000 });
    const grid = page.locator('.col-md-9, [class*="products"], main').first();
    await expect(grid).toHaveScreenshot('product-grid.png');
  });

  test('TC-023: cart sidebar snapshot', async ({ page }) => {
    // Navigate to a product and add to cart
    await page.goto('/');
    await page.waitForSelector('[data-test="product-name"]', { timeout: 15000 });
    await page.locator('[data-test="product-name"]').first().click();
    await page.waitForLoadState('networkidle');
    await page.locator('[data-test="add-to-cart"]').click();
    // Navigate to cart
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toHaveScreenshot('cart-sidebar.png');
  });
});
