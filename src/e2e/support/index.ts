import './commands'
import 'cypress-plugin-tab'

beforeEach(() => {
  cy.on('window:load', (win) => {
    win.addEventListener('unhandledrejection', (event) => {
      throw new Error('Unhandled promise rejection: ' + event.reason)
    })
  })
})
