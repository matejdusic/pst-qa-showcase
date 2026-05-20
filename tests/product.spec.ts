import { test, expect } from '../fixtures/pageFixtures';

test.describe('Product — Detail Page', () => {
  test('TC-006: product detail page loads', async ({ productPage, productId }) => {
    await productPage.goto(productId);
    await expect(productPage.productTitle).toBeVisible();
  });

  test('TC-007: product price is displayed', async ({ productPage, productId }) => {
    await productPage.goto(productId);
    await expect.soft(productPage.price).toBeVisible();
    const priceText = (await productPage.price.textContent()) ?? '';
    expect(priceText).toMatch(/\d/);
  });

  test('TC-008: add-to-cart button is present and clickable', async ({ productPage, productId }) => {
    await productPage.goto(productId);
    await expect(productPage.addToCartButton).toBeVisible();
    await productPage.addToCart();
    // Button should still be present after click (no navigation)
    await expect(productPage.addToCartButton).toBeVisible();
  });

  test('TC-009: product description is visible', async ({ productPage, productId }) => {
    await productPage.goto(productId);
    await expect(productPage.productDescription).toBeVisible();
  });
});
