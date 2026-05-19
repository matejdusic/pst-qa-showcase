import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Result } from 'axe-core';
import { ProductPage } from '../pages/ProductPage';

/**
 * Navigate to a product detail page and click add-to-cart.
 * Shared across cart, integration, and visual specs to avoid duplicating the flow.
 */
export async function addProductToCart(
  productPage: ProductPage,
  productId: string
): Promise<void> {
  await productPage.goto(productId);
  await productPage.addToCart();
}

/**
 * Run an axe-core audit against the current page and return only critical violations.
 * Non-critical violations are logged to console but never fail the test — this matches
 * the agency policy of failing on critical issues only.
 */
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
