/* eslint-disable no-restricted-syntax,no-console,@typescript-eslint/no-var-requires */

const path = require('path')
const wp = require('@cypress/webpack-preprocessor')
const gmail = require('gmail-tester')
const BlinkDiff = require('blink-diff')
const fs = require('fs')

// If you up these you'll probably want to up the timeout on the connection too (email.spec.ts)
const WAIT_TIME_BETWEEN_EMAIL_RETRIES = 15000
const MAX_ATTEMPTS_TO_FIND_EMAIL = 20

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function runDiff(imageAPath, imageBPath, imageOutputPath) {
  const diff = new BlinkDiff({
    imageAPath,
    imageBPath,
    thresholdType: BlinkDiff.THRESHOLD_PIXEL,
    threshold: 0.01,
    imageOutputPath,
    delta: 5,
    debug: true,
    cropImageB: false,
    cropImageA: false,
  })

  const { code } = diff.runSync()
  const success = diff.hasPassed(code)
  if (success && imageOutputPath) {
    console.log('Succeeded, so deleting successful output')
    fs.unlinkSync(imageOutputPath)
  }

  return success
}

function attemptScreenshotUpdate(screenshotPath, expectedScreenshot) {
  const consistencyCheckFile = `${screenshotPath}.consistencyCheck`
  if (!fs.existsSync(consistencyCheckFile)) {
    console.log(
      `Writing first update attempt to ${consistencyCheckFile.substring(
        consistencyCheckFile.lastIndexOf('/')
      )}, will screenshot again to ensure they are consistent`
    )
    fs.renameSync(screenshotPath, consistencyCheckFile)
    return false
  } else {
    const newScreenshotIsConsistent = runDiff(consistencyCheckFile, screenshotPath, undefined)
    if (!newScreenshotIsConsistent) {
      console.log(`New screenshot didn't match the last one, will try again...`)
      fs.renameSync(screenshotPath, consistencyCheckFile)
    } else {
      console.log('Generated two consistent screenshots in a row, setting new screenshot as expected')
      fs.unlinkSync(consistencyCheckFile)
      fs.renameSync(screenshotPath, expectedScreenshot)
    }

    return newScreenshotIsConsistent
  }
}

export function setupNodeEvents(on, config) {
  const options = {
    webpackOptions: require('../webpack.config'),
  }

  on('file:preprocessor', wp(options))

  on('before:browser:launch', (browser, launchOptions) => {
    const sampleFile = path.resolve('samples/speech.wav')
    launchOptions.args.push('--no-sandbox')
    launchOptions.args.push('--use-fake-ui-for-media-stream')
    launchOptions.args.push('--use-fake-device-for-media-stream')
    launchOptions.args.push(`--use-file-for-fake-audio-capture=${sampleFile}`)
    launchOptions.args.push('--disable-site-isolation-trials')
    launchOptions.args.push('--no-experiments')
    launchOptions.args.push('--enable-logging')
    launchOptions.args.push('--v=1')

    if (config.env.USE_BROWSER_EXTENSION) {
      const extensionDir = path.resolve(config.env.BROWSER_EXTENSION_PATH)
      launchOptions.args.push(`--load-extension=${extensionDir}`)
      launchOptions.args.push('--auto-select-desktop-capture-source=e2e')
    }

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
    'match-screenshot': async (args) => {
      const { screenshotPath, name } = args

      const diffsPath = `${__dirname}/../diffs`
      const screenshotDir = screenshotPath.substring(0, screenshotPath.lastIndexOf('/') + 1)
      const expectedScreenshot = `${diffsPath}/${name}.png`

      if (fs.existsSync(expectedScreenshot) && config.env.UPDATE_SNAPSHOTS !== true) {
        const imageOutputPath = `${screenshotDir}/output-${name}.png`
        return runDiff(expectedScreenshot, screenshotPath, imageOutputPath)
      } else {
        return attemptScreenshotUpdate(screenshotPath, expectedScreenshot)
      }
    },
    'gmail:get-message': async (args) => {
      const { to, subject } = args

      const gmailTokenPath = config.env.PATH_TO_GMAIL_TOKEN_JSON
      const gmailCredentialsPath = config.env.PATH_TO_GMAIL_CREDENTIALS_JSON

      for (let i = 0; i < MAX_ATTEMPTS_TO_FIND_EMAIL; i++) {
        const messages = await gmail.get_messages(
          path.resolve(__dirname, gmailCredentialsPath),
          path.resolve(__dirname, gmailTokenPath),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          { include_body: true, to }
        )

        const found = messages.length > 0 ? messages[0] : undefined
        if (found !== undefined && found.subject === subject) {
          return found
        } else {
          await sleep(WAIT_TIME_BETWEEN_EMAIL_RETRIES)
        }
      }

      return null
    },
  })
}
