import { v4 as uuidv4 } from 'uuid'
import * as LogInForm from './glean/pages/LogInForm'
import * as GlobalHeader from './glean/components/GlobalHeader'
import 'cypress-wait-until'
import AUTWindow = Cypress.AUTWindow

const randomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max))

export const generateShortEmailAddress = () => `user-${randomInt(10000000)}@glean.co`

export const generateEmailAddress = (domain: string = 'sonocent.com') => `dev-test+${uuidv4()}@${domain}`

export const suffixEmail = (email: string, suffix: string) => email.replace('@', `+${suffix}@`)

export const newEmailAddress = () => `baldrick+${uuidv4()}@glean.co`

export const repeat = (times: number, fn: () => void) => [...Array(times).keys()].forEach(fn)

// force field to blur to prevent cursor blipping in and out of screenshot
export const blur = (field: Cypress.Chainable<JQuery<HTMLElement>>) => field.focus().blur()

export const hideScrollbars = (cssSelector: string) => {
  cy.get(cssSelector).invoke('css', 'overflow', 'hidden')
}

export const hideScrollbarsByDataTest = (dataTest: string) => {
  cy.getByDataTest(dataTest).invoke('css', 'overflow', 'hidden')
}

export const showScrollbars = (cssSelector: string) => {
  cy.get(cssSelector).invoke('css', 'overflow', 'auto')
}

export const dataTestSelector = (value: string) => `[data-test="${value}"]`

export interface WindowFunctionParams {
  functionName: string
  expectedResult?: any
  waitMessage?: string
}

export function waitForServiceWorker(): Chainable<any> {
  return cy.reload().then((window) => {
    Cypress.log({ name: 'waitForSw', message: 'Waiting for Service Worker to install...' })
    return checkForServiceWorker(window).then((result) => {
      if (!result) {
        Cypress.log({ name: 'waitForSw', message: 'Service Worker not present, reloading to kick it' })
        return waitForServiceWorker()
      }

      Cypress.log({ name: 'waitForSw', message: 'Service Worker is present! Proceeding.' })
      return result
    })
  })
}

/**
 * Facts that have motivated this approach:
 *
 *  - If the worker isn't present, then navigator.serviceWorker.ready returns a Promise that will never complete.
 *  - There is no way to "catch" a timeout error from Cypress in order to retry.
 *  - Therefore, we use Promise.race to give ourselves a Promise which is guaranteed to complete before the Cypress timeout
 *    of 20 seconds. If the worker appears within 5 seconds, we'll return true, else we'll return false and can refresh and try again.
 */
const checkForServiceWorker = async (window: AUTWindow): Promise<boolean> => {
  const timeoutPromise = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000))

  return await Promise.race([
    makeSwPromise(window, 1000),
    makeSwPromise(window, 2000),
    makeSwPromise(window, 4000),
    timeoutPromise,
  ])
}

const makeSwPromise = (window: AUTWindow, delay: number) =>
  new Promise<boolean>((resolve) =>
    setTimeout(() => {
      Cypress.log({ name: 'waitForSw', message: 'Awaiting serviceWorker.ready' })
      window.navigator.serviceWorker.ready.then(() => resolve(!!window.navigator.serviceWorker.controller))
    }, delay)
  )

const waitForWindowObject = (windowProp: string) => {
  cy.window().should(async (theWindow) => {
    const window = theWindow as any
    expect(window[windowProp]).not.to.eq(undefined, `waiting for ${windowProp} to be present on window`)
  })
}

export const callWindowFunction = (
  { functionName, expectedResult, waitMessage }: WindowFunctionParams,
  ...args: any[]
) => {
  waitForWindowObject(functionName)

  cy.window().then(async (theWindow) => {
    const window = theWindow as any
    if (expectedResult) {
      expect(await window[functionName](...args)).to.eq(expectedResult, waitMessage)
    } else {
      await window[functionName](...args)
    }
  })
}

export const checkAllEnvironmentVariablesAreSet = () =>
  callWindowFunction({ functionName: 'areAllEnvironmentVariablesSet', expectedResult: true })

export const logOutAndClearLocalData = () => {
  callWindowFunction({ functionName: 'openDebug' })
  cy.getByDataTest('debug-view__storage-tab').click().getByDataTest('deleteIDB').click()
  waitUntilLoggedOut()
}

export const switchToNewSuperUser = (next: (user: Cypress.User) => void) =>
  cy.setupUser({ role: 'SUPER_USER' }).then((toUser) => {
    switchUser(toUser)
    next(toUser)
  })

const waitUntilLoggedOut = () => {
  LogInForm.verifyIsShown()
  // eslint-disable-next-line no-restricted-syntax
  cy.waitUntil(() => cy.getCookie('userId').then((cookie) => cookie === null), { timeout: 5000 })
}

export const switchUser = (newUser: Cypress.User) => {
  GlobalHeader.clickLogOut()

  waitUntilLoggedOut()
  cy.loginUser(newUser)
  // eslint-disable-next-line no-restricted-syntax
  cy.waitUntil(() => cy.getCookie('userId').then((cookie) => cookie !== null), { timeout: 5000 })
}

export const linkWorks = (testId: string, expectedText: string) => {
  cy.getByDataTest(testId).invoke('removeAttr', 'target').click()
  cy.url().then((url) =>
    cy.request(url).then((response) => {
      expect(response.status).eq(200)
      expect(response.body).contains(expectedText)
    })
  )
}

/**
 * Enable Cypress to read the clipboard
 * https://github.com/cypress-io/cypress/issues/2752#issuecomment-981468673
 */
export const grantClipboardPermissions = () => {
  cy.wrap(
    Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: { permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] },
    })
  )
}

export const getClipboardContents = (): Chainable<string> =>
  cy.window().then((win) => win.navigator.clipboard.readText())
