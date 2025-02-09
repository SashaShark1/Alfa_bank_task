/* eslint-disable sort/object-properties */
import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  expect: {
    timeout: 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Run tests in files in parallel */
  fullyParallel: false,
  // globalSetup: require.resolve('./src/setup/global.setup'),
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'attachments',
  /* Maximum time one test can run for. */
  timeout: 50 * 1000,
  /* Configure projects for major browsers */
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.URL,
    /** Set the test id to use a custom data attribute */
    testIdAttribute: 'data-testid',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',
    // video: {
    //   mode: 'retain-on-failure',
    // },
    screenshot: 'only-on-failure',
    headless: false,
  },
  projects: [
    // { name: 'auth setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium:market',
      testDir: './tests',
      use: {
        ...devices['Desktop Chrome'],
        // storageState: 'playwright/.auth/user.json',
      },
      // dependencies: ['auth setup'],
    },
  ],
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'null',
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        detail: false,
        outputFolder: 'allure-results',
        suiteTitle: false,
      },
    ],
  ],
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
});
