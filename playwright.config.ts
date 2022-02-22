import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  // globalSetup: './global-setup',
  use: {
    // headless: false,
    trace: 'retain-on-failure',
    // storageState: './data/state/loggedInState.json',
    screenshot: 'only-on-failure'
  },
  // retries: 1,
  projects: [
    // { name: 'Firefox', use: { browserName: 'firefox' } }
    // { name: 'Webkit', use: { browserName: 'webkit' } }
    { name: 'Chromium', use: { browserName: 'chromium' } }
  ],
  reporter: [
    ['html', { outputFolder: 'test-results/report' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list']
  ]
};
export default config;
