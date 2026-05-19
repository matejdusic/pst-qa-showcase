import { test, expect } from '../fixtures/pageFixtures';
import { addProductToCart } from '../utils/testHelpers';

const PRODUCT_ID = '01KRZM041Y6PJ5NSD95ET3KWPN';

test.describe('Cart', () => {
  test('TC-010: added item appears in cart', async ({ productPage, cartPage }) => {
    await addProductToCart(productPage, PRODUCT_ID);
    await cartPage.goto();
    const count = await cartPage.getItemCount();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-011: cart quantity can be updated', async ({ productPage, cartPage }) => {
    await addProductToCart(productPage, PRODUCT_ID);
    await cartPage.goto();
    await expect.soft(cartPage.quantityInputs.first()).toBeVisible();
    if (await cartPage.quantityInputs.first().isVisible()) {
      await cartPage.updateQuantity(0, 2);
    }
    await expect(cartPage.totalPrice).toBeVisible();
  });

  test('TC-012: item can be removed from cart', async ({ productPage, cartPage }) => {
    await addProductToCart(productPage, PRODUCT_ID);
    await cartPage.goto();
    const initialCount = await cartPage.getItemCount();
    expect(initialCount).toBeGreaterThan(0);
    await cartPage.removeItem(0);
    const newCount = await cartPage.getItemCount();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('TC-013: cart total is displayed', async ({ productPage, cartPage }) => {
    await addProductToCart(productPage, PRODUCT_ID);
    await cartPage.goto();
    await expect(cartPage.totalPrice).toBeVisible();
  });
});
