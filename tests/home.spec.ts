import { test, expect } from '../fixtures/pageFixtures';

test.describe('Home — Catalogue', () => {
  test('TC-001: catalogue loads on homepage', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
    await expect(homePage.firstProductCard).toBeVisible();
  });

  test('TC-002: search returns relevant results', async ({ homePage }) => {
    await homePage.goto();
    await homePage.search('Pliers');
    await homePage.waitForProducts();
    await expect.soft(homePage.firstProductCard).toBeVisible();
    const firstTitle = (await homePage.firstProductCard.textContent())?.toLowerCase() ?? '';
    expect(firstTitle).toContain('plier');
  });

  test('TC-003: category filter narrows product list', async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    const initialCount = await homePage.productCards.count();
    await homePage.filterByCategory('hand-tools');
    await expect.soft(homePage.firstProductCard).toBeVisible();
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
    await homePage.waitForProducts();
    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
