import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://practicesoftwaretesting.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'anonymous',
      testMatch: /tests\/(home|product|cart|login)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'authenticated',
      testMatch: /tests\/(auth|account)\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile',
      testMatch: /tests\/home\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'visual',
      testMatch: /tests\/visual\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testMatch: /tests\/api\.spec\.ts/,
    },
    {
      name: 'integration',
      testMatch: /tests\/integration\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mock',
      testMatch: /tests\/mock\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'a11y',
      testMatch: /tests\/a11y\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
