import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  testDir: './probes', fullyParallel: false, workers: 1, retries: 0, timeout: 30000,
  reporter: [['list'], ['json', { outputFile: 'qa-probe-results/results.json' }]],
  outputDir: 'qa-probe-results/artifacts',
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, viewport: { width: 1280, height: 800 }, trace: 'off', screenshot: 'off' },
  webServer: {
    cwd: fileURLToPath(new URL('../../../', import.meta.url)),
    command: `"${process.execPath}" node_modules/vite/bin/vite.js preview --port 4173 --host 127.0.0.1 --strictPort`,
    url: 'http://127.0.0.1:4173', reuseExistingServer: false,
    env: { NODE_ENV: 'test', VITE_APP_ENV: 'test' }
  }
});
