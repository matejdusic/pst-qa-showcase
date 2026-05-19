import { test, expect } from '../fixtures/pageFixtures';
import { getCriticalViolations } from '../utils/testHelpers';

const PRODUCT_ID = '01KRXJRPSQT6WT1J2VKCH86Y82';

test.describe('Accessibility — WCAG 2.0', () => {
  test('TC-031: homepage passes WCAG 2.0 (no critical violations)', async ({
    homePage,
    page,
  }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations).toHaveLength(0);
  });

  test('TC-032: product page passes WCAG 2.0', async ({ productPage, page }) => {
    await productPage.goto(PRODUCT_ID);
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations).toHaveLength(0);
  });

  test('TC-033: login page passes WCAG 2.0', async ({ loginPage, page }) => {
    await loginPage.goto();
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations).toHaveLength(0);
  });
});
