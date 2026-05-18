import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';

export async function navigateToProduct(page: Page, productId: string): Promise<void> {
  await page.goto(`/product/${productId}`);
  await page.waitForLoadState('networkidle');
}

export async function waitForCatalogue(page: Page): Promise<void> {
  await page.waitForSelector('[data-test="product-name"]', { timeout: 15000 });
}

export async function getCriticalViolations(page: Page): Promise<Result[]> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  if (violations.length > 0) {
    console.log(
      violations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join('\n')
    );
  }
  return violations.filter((v) => v.impact === 'critical');
}
