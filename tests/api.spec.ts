import { test, expect } from '@playwright/test';

// API tests run without a browser context. They use Playwright's built-in
// request fixture (via global fetch) to verify the REST contract directly.
const API_BASE = 'https://api.practicesoftwaretesting.com';
const PRODUCTS_ENDPOINT = `${API_BASE}/products`;
const LOGIN_ENDPOINT = `${API_BASE}/users/login`;

test.describe('API Contract Tests', () => {
  test('TC-024: product listing returns valid schema', async () => {
    const res = await fetch(PRODUCTS_ENDPOINT, {
      headers: { Accept: 'application/json' },
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    const first = data.data[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
  });

  test('TC-025: search API returns matching products', async () => {
    const res = await fetch(`${PRODUCTS_ENDPOINT}?q=Pliers`, {
      headers: { Accept: 'application/json' },
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data).toHaveProperty('data');
    expect(data.data.length).toBeGreaterThan(0);
    const names: string[] = data.data.map((p: { name: string }) => p.name.toLowerCase());
    expect(names.some((n) => n.includes('plier'))).toBe(true);
  });

  test('TC-026: auth endpoint returns access token', async () => {
    const res = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: process.env.SITE_USERNAME || 'customer2@practicesoftwaretesting.com',
        password: process.env.SITE_PASSWORD || 'welcome01',
      }),
    });
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(data).toHaveProperty('access_token');
    expect(typeof data.access_token).toBe('string');
    expect(data.access_token.length).toBeGreaterThan(0);
  });
});
