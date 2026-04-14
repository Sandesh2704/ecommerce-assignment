import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',

  use: {
    baseURL: 'http://localhost:3000',
      viewport: { width: 1280, height: 800 },
  },

  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },
});