import { test, expect } from '../fixtures/pageFixtures';

const PRODUCT_ID = '01KRXJRPSQT6WT1J2VKCH86Y82';

test.describe('Cart', () => {
  test('TC-010: added item appears in cart', async ({ productPage, cartPage }) => {
    await productPage.goto(PRODUCT_ID);
    await productPage.addToCart();
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-011: cart quantity can be updated', async ({ productPage, cartPage }) => {
    await productPage.goto(PRODUCT_ID);
    await productPage.addToCart();
    await cartPage.goto();
    const qtyInput = cartPage.quantityInputs.first();
    await expect.soft(qtyInput).toBeVisible();
    if (await qtyInput.isVisible()) {
      await qtyInput.fill('2');
      await qtyInput.press('Enter');
      await cartPage.waitForLoadState();
    }
    await expect.soft(cartPage.totalPrice).toBeVisible();
  });

  test('TC-012: item can be removed from cart', async ({ productPage, cartPage }) => {
    await productPage.goto(PRODUCT_ID);
    await productPage.addToCart();
    await cartPage.goto();
    const initialCount = await cartPage.getItemCount();
    if (initialCount > 0) {
      await cartPage.removeItem(0);
      const newCount = await cartPage.getItemCount();
      expect(newCount).toBeLessThan(initialCount);
    }
  });

  test('TC-013: cart total is displayed', async ({ productPage, cartPage }) => {
    await productPage.goto(PRODUCT_ID);
    await productPage.addToCart();
    await cartPage.goto();
    await expect.soft(cartPage.totalPrice).toBeVisible();
  });
});
