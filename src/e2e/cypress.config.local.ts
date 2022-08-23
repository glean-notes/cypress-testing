import ciConfig from './cypress.config'
import {defineConfig} from 'cypress'

export default defineConfig({
  ...ciConfig,
  env: {
    COOKIE_DOMAIN: 'cypress-testing-2.dev.glean.ninja',
    ADMIN_URL: 'https://cypress-testing-2.dev.glean.ninja/admin',
    GLEAN_URL: 'https://cypress-testing-2.dev.glean.ninja',
    LOG_FAILURES_TO_KIBANA: 'false',
  },
  e2e: {
    ...ciConfig.e2e,
    baseUrl: 'https://cypress-testing-2.dev.glean.ninja',
  },
})
