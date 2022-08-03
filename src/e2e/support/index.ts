import './commands'
import 'cypress-plugin-tab'
import { setUpFailureLogging } from './failureLogging'

export const testUserIds = {
  baldrick: 'e4cb0a70-7953-11e8-adc0-fa7ae01bbebc',
  flashheart: '1050dadc-cf4a-4804-ad4f-236c1f2fc8cf',
}

beforeEach(() => {
  cy.on('window:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      throw new Error('Unhandled promise rejection: ' + event.reason)
    })
  })
  cy.visitAdmin('/')
  indexedDB.deleteDatabase(`glean-${testUserIds.baldrick}`)
  indexedDB.deleteDatabase(`glean-${testUserIds.flashheart}`)
  cy.logout()
  cy.clearCookies()
})

if (Cypress.env('LOG_FAILURES_TO_KIBANA') !== 'false') {
  setUpFailureLogging()
}
