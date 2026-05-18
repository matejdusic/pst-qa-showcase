import { test, expect } from '../fixtures/pageFixtures';

test.describe('Home — Catalogue', () => {
  test('TC-001: catalogue loads on homepage', async ({ homePage }) => {
    await homePage.goto();
    await expect.soft(homePage.productCards.first()).toBeVisible();
    await expect(homePage.productCards.first()).toBeVisible();
  });

  test('TC-002: search returns relevant results', async ({ homePage }) => {
    await homePage.goto();
    await homePage.search('Pliers');
    await expect.soft(homePage.productCards.first()).toBeVisible();
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
    const firstTitle = await homePage.productCards.first().textContent();
    expect(firstTitle?.toLowerCase()).toContain('plier');
  });

  test('TC-003: category filter narrows product list', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    const initialCount = await homePage.productCards.count();
    // Click hand-tools category
    await page.locator('[data-test="nav-hand-tools"]').click();
    await page.waitForLoadState('networkidle');
    await expect.soft(homePage.productCards.first()).toBeVisible();
    const filteredCount = await homePage.productCards.count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('TC-004: product card navigates to product detail', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    await homePage.clickFirstProduct();
    await expect(page).toHaveURL(/\/product\//);
  });

  test('TC-005: catalogue visible on mobile viewport @mobile', async ({ homePage }) => {
    await homePage.goto();
    await expect.soft(homePage.productCards.first()).toBeVisible();
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
