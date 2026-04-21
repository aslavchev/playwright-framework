import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const environmentPath = process.env.ENVIRONMENT
    ? `./env/.env.${process.env.ENVIRONMENT}`
    : `./env/.env.dev`;

dotenv.config({
    path: environmentPath,
});

const uiConfig = {
    ...devices['Desktop Chrome'],
    baseURL: process.env.UI_URL,
    testIdAttribute: 'data-test',
    storageState: '.auth/userSession.json',
    screenshot: 'only-on-failure',
} as const;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'blob' : 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'api',
            use: {
                baseURL: process.env.API_URL,
                extraHTTPHeaders: {
                    Authorization: `Bearer ${process.env.TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            },
            testMatch: /.*\.api\.spec\.ts/,
        },
        {
            name: 'ui-setup',
            use: {
                baseURL: process.env.UI_URL,
                testIdAttribute: 'data-test',
            },
            testMatch: /.*\.ui\.setup\.ts/,
        },
        {
            name: 'chromium',
            use: uiConfig,
            testMatch: /.*\.ui\.spec\.ts/,
            dependencies: ['ui-setup'],
        },
        {
            name: 'e2e',
            use: uiConfig,
            testMatch: /.*\.e2e\.spec\.ts/,
            dependencies: ['ui-setup'],
        },
    ],
});
