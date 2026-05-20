import { test, expect } from '../fixtures/pageFixtures';
import { getCriticalViolations } from '../utils/testHelpers';

/**
 * Known site defects detected by axe-core. These are real WCAG violations
 * on practicesoftwaretesting.com, not problems in our test code. They are
 * filtered out so the suite still passes on regressions to other rules —
 * but the violations are surfaced in the demo as a found defect.
 *
 *  - button-name: the password-visibility toggle on /auth/login has no
 *    accessible name (no aria-label, no inner text).
 */
const KNOWN_SITE_DEFECTS = ['button-name'];

test.describe('Accessibility — WCAG 2.0', () => {
  test('TC-031: homepage passes WCAG 2.0 (no critical violations)', async ({
    homePage,
    page,
  }) => {
    await homePage.goto();
    await homePage.waitForProducts();
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations.map((v) => v.id)).toEqual([]);
  });

  test('TC-032: product page passes WCAG 2.0', async ({ productPage, productId, page }) => {
    await productPage.goto(productId);
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations.map((v) => v.id)).toEqual([]);
  });

  test('TC-033: login page passes WCAG 2.0 (excluding known site defects)', async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    const criticalViolations = await getCriticalViolations(page);
    const newViolations = criticalViolations.filter(
      (v) => !KNOWN_SITE_DEFECTS.includes(v.id)
    );
    expect(newViolations.map((v) => v.id)).toEqual([]);
  });
});
