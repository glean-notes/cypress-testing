import { defineConfig } from 'cypress'
import { setupNodeEvents } from 'plugins/index.js'

export default defineConfig({
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  fixturesFolder: 'fixtures',
  defaultCommandTimeout: 20000,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  numTestsKeptInMemory: 0,
  projectId: 'unused',
  e2e: {
    specPattern: 'integration/**/*.spec.ts',
    supportFile: 'support/index.ts',
    setupNodeEvents,
  },
})
