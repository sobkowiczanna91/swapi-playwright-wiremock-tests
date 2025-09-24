import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    globalSetup: './global-setup.ts',
    globalTeardown: './global-teardown.ts',
    retries: 1,
    reporter: [
        ['list'],
        ['allure-playwright'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }]
    ],
    timeout: 10000,
    use: {
        baseURL: process.env.BASE_URL || 'http://localhost:4200',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
        headless: false,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'], headless: false} },
        { name: 'firefox', use: { ...devices['Desktop Firefox'], headless: false} },
        { name: 'webkit', use: { ...devices['Desktop Safari'], headless: false } }
    ]
});
