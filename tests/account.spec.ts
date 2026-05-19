import { test, expect } from '../fixtures/pageFixtures';

test.describe('Account', () => {
  test('TC-019: profile page displays user info', async ({ accountPage }) => {
    await accountPage.goto();
    await expect(accountPage.pageTitle).toBeVisible();
    const text = await accountPage.pageTitle.textContent();
    expect(text?.trim().length ?? 0).toBeGreaterThan(0);
  });

  test('TC-020: account dashboard surfaces all sections', async ({ accountPage }) => {
    await accountPage.goto();
    // The dashboard shows four navigation cards. Use soft assertions so the
    // test reports every missing card in one run rather than failing fast.
    await expect.soft(accountPage.favoritesCard).toBeVisible();
    await expect.soft(accountPage.profileCard).toBeVisible();
    await expect.soft(accountPage.invoicesCard).toBeVisible();
    await expect.soft(accountPage.messagesCard).toBeVisible();
    // Hard assertion: at least one dashboard card must be present.
    const count = await accountPage.dashboardCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
