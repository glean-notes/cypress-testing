import * as EventPage from './EventPage'
import * as SendEventModal from '../dialogs/SendEventModal'
import { getNonDisabled } from '../../componentHelpers'

export const verifyIsLoaded = () => {
  cy.get('.events-layout').should('exist')
  cy.getByDataTest('loading-events-list-loader').should('not.exist')
  cy.get('.events-layout__content').should('exist')
}

export const visit = () => {
  cy.visit('/events')
  verifyIsLoaded()
}

export const loginAndVisitEventsPage = (username: string) => {
  cy.login(username)
  visit()
  verifyIsLoaded()
}

export const loginUserAndVisitEventsPage = (user: Cypress.User) => loginAndVisitEventsPage(user.email)

const getNewEventButton = () => cy.getByDataTest('newEventButton')
export const clickNewEvent = () => getNewEventButton().click({ force: true })
export const manualClickNewEvent = () => {
  getNewEventButton().trigger('click')
}

export const logInAndCreateEvent = (username: string) => {
  cy.login(username)
  visit()
  clickNewEvent()
  EventPage.verifyIsLoaded()
}

export const assertEventWithTitleExists = (title: string) => {
  cy.get('.events-table').within(() => cy.contains(title))
}

export const assertEventWithTitleDoesNotExist = (title: string) => {
  cy.get('.events-table').should('not.have.text', title)
}

export const visitEventWithTitle = (title: string) => {
  cy.get('.events-table').within(() => {
    cy.contains(title).click()
  })
  EventPage.verifyIsLoaded()
}

export const assertNumberOfRows = (expectedCount: number) =>
  cy.getByDataTest('eventTableRow').should('have.length', expectedCount)

export const verifyPageNotFoundIsLoaded = () => cy.get('.page-not-found__content')

export const getFirstEventTitle = (testBlock: (title: string) => void) =>
  cy
    .get('.events-table-name')
    .invoke('text')
    .then((title: string) => {
      testBlock(title)
    })

export const clickFirstEventDropdown = () => cy.get('.events-table-row__actions-cell').first().click()
export const clickDropdownDelete = () =>
  cy.get('.events-table-row__actions-cell').get('.dropdown-menu--active').contains('Delete Event').click()
export const clickDropdownSendACopy = () => {
  cy.get('.events-table-row__actions-cell').get('.dropdown-menu--active').contains('Send a Copy').click()
  SendEventModal.verifyIsShown()
}
export const verifySendACopyNotVisible = () => {
  cy.get('.events-table-row__actions-cell').get('.dropdown-menu--active').contains('Send a Copy').should('not.exist')
}

export const clickDropdownDeleteCancel = () => cy.getByDataTest('ConfirmDeleteEventModal-cancel').click()
export const clickDropdownDeleteConfirm = () => cy.getByDataTest('ConfirmDeleteEventModal-delete').click()

export const expectModalOpen = () => cy.get('.ReactModalPortal .ReactModal__Content').should('be.visible')
export const expectModalClosed = () => cy.get('.ReactModalPortal .ReactModal__Content').should('not.exist')

export const waitForEventToUpload = () => cy.getByDataTest('EventDirtyIndicator.icon').should('not.be.visible')

export const getFirstEventId = () =>
  cy
    .getByDataTest('eventTableNameCell')
    .find('a')
    .then((link) => {
      const eventUrl = link.prop('href')

      if (eventUrl) {
        const eventUrlString = eventUrl as string
        const lastSlashIndex = eventUrlString.lastIndexOf('/')
        return eventUrlString.substring(lastSlashIndex + 1)
      } else {
        throw Error('No event was found')
      }
    })

export const clickNeedHelpButton = () => getNonDisabled('[data-test="help-button"]').click()

export const verifyDemoButtonVisible = () => getNonDisabled('[data-test="demoEventLink"]')
export const clickDemoButton = () => getNonDisabled('[data-test="demoEventLink"]').click()

export const clickSearchButton = () => cy.getByDataTest('searchButton').click()

export const clickJoinEventButton = () => {
  cy.getByDataTest('joinSharedEventButton').click()
}

export const clickGuidedTourButton = () => {
  cy.getByDataTest('guided-tour-button').click({ force: true })
}
