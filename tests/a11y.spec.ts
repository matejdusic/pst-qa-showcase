import { test, expect } from '@playwright/test';
import { getCriticalViolations } from '../utils/testHelpers';

test.describe('Accessibility — WCAG 2.0', () => {
  test('TC-031: homepage passes WCAG 2.0 (no critical violations)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-test="product-name"]', { timeout: 15000 });
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations).toHaveLength(0);
  });

  test('TC-032: product page passes WCAG 2.0', async ({ page }) => {
    await page.goto('/product/01KRXJRPSQT6WT1J2VKCH86Y82');
    await page.waitForLoadState('networkidle');
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations).toHaveLength(0);
  });

  test('TC-033: login page passes WCAG 2.0', async ({ page }) => {
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
    const criticalViolations = await getCriticalViolations(page);
    expect(criticalViolations).toHaveLength(0);
  });
});
