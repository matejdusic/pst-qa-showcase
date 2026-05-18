import { test, expect } from '@playwright/test';

test.describe('Network Mock / Intercept', () => {
  test('TC-029: page renders with images blocked', async ({ page }) => {
    await page.route('**/*.{jpg,jpeg,png,gif,webp,svg}', (route) => route.abort());
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Page structure should still be present even without images
    await expect(page.locator('[data-test="product-name"]').first()).toBeVisible({
      timeout: 15000,
    });
  });

  test('TC-030: intercepted product API returns mock data gracefully', async ({ page }) => {
    await page.route('**/api/products**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 'mock-1',
              name: 'Mocked Product',
              price: 9.99,
              description: 'A mocked product for testing',
              category_id: 'cat-1',
            },
          ],
          meta: { total: 1, per_page: 9, current_page: 1, last_page: 1 },
        }),
      });
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Page should load without crashing
    await expect(page.locator('body')).toBeVisible();
  });
});
