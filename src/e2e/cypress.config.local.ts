import ciConfig from './cypress.config'
import {defineConfig} from 'cypress'

export default defineConfig({
  ...ciConfig,
  env: {
    COOKIE_DOMAIN: 'notest-simplify-admin.dev.glean.ninja',
    ADMIN_URL: 'https://notest-simplify-admin.dev.glean.ninja/admin',
    GLEAN_URL: 'https://notest-simplify-admin.dev.glean.ninja',
    LOG_FAILURES_TO_KIBANA: 'false',
  },
  e2e: {
    ...ciConfig.e2e,
    baseUrl: 'https://notest-simplify-admin.dev.glean.ninja',
  },
})
