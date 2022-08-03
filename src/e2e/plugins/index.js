/* eslint-disable no-restricted-syntax,no-console,@typescript-eslint/no-var-requires */

const wp = require('@cypress/webpack-preprocessor')
const fs = require('fs')

export function setupNodeEvents(on, config) {
  const options = {
    webpackOptions: require('../webpack.config'),
  }

  on('file:preprocessor', wp(options))

  on('before:browser:launch', (browser, launchOptions) => {
    launchOptions.args.push('--no-sandbox')
    launchOptions.args.push('--disable-site-isolation-trials')
    launchOptions.args.push('--no-experiments')
    launchOptions.args.push('--enable-logging')
    launchOptions.args.push('--v=1')

    // Turn off safebrowsing for chrome/edge via prefs, see https://docs.cypress.io/api/plugins/browser-launch-api#Changing-browser-preferences
    /* eslint-disable @typescript-eslint/naming-convention */
    const originalPrefs = launchOptions.preferences.default
    launchOptions.preferences.default = {
      ...originalPrefs,
      safebrowsing: {
        enabled: false,
      },
      search: {
        suggest_enabled: false,
      },
      translate: {
        enabled: false,
      },
      signin: {
        allowed: false,
        allowed_on_next_startup: false,
      },
      credentials_enable_autosignin: false,
      credentials_enable_service: false,
      alternate_error_pages: {
        enabled: false,
      },
    }
    /* eslint-enable @typescript-eslint/naming-convention */

    return launchOptions
  })

  on('after:spec', async (spec, results) => {
    if (results.stats.failures === 0) {
      /**
       * Cypress will always write videos to disk, regardless of success/failure.
       * Workaround so we only archive videos for failures - see https://github.com/cypress-io/cypress/issues/2522
       */
      if (results.video && config.env.DELETE_SUCCESS_VIDEOS === true) {
        await fs.unlinkSync(results.video)
      }
    }
  })

  on('task', {
    log(message) {
      console.log(message)
      return null
    },
  })
}
