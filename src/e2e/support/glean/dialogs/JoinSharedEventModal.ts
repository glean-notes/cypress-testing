export const passcodeField = () => cy.get('.join-shared-event-modal__passcode')
export const verifyIsShown = passcodeField
export const clickClose = () => {
  cy.getByDataTest('close-button').click()
}
export const clickJoin = () => {
  cy.getByDataTest('JoinSharedEventModal-join').click()
}
export const typePasscode = (passcode: string) => passcodeField().focus().should('have.focus').type(passcode)
