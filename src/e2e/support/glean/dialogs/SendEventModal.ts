import * as SelectEventsPage from '../pages/SelectEventsPage'

export const emailField = () => cy.get('.send-event-modal__email-address')
export const verifyIsShown = emailField
export const clickSend = () => {
  cy.getByDataTest('SendEventModal-send').click()
  cy.getByDataTest('modal-loading').should('not.exist')
}

export const clickCancel = () => {
  cy.getByDataTest('SendEventModal-cancel').click()
  SelectEventsPage.verifyIsLoaded()
}

export const enterEmail = (email: string) => emailField().type(email)

export const verifyEventCopySuccessToastIsShown = () => cy.get('#eventCopySentToastId')
export const verifySuccessToastDismissed = () => cy.get('#eventCopySentToastId').should('not.exist')
