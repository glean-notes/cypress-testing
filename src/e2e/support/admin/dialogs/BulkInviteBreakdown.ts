export const close = () => cy.getByDataTest('bulk-invite-close').click()
export const verifyIsShown = () => cy.getByDataTest('bulk-invite-breakdown')
export const verifyIsNotShown = () => cy.getByDataTest('bulk-invite-breakdown').should('not.exist')

export const getOverviewEmailsFoundDescription = () => cy.getByDataTest('overview__emails-found-description')
export const getOverviewUnsuccessfulDescription = () => cy.getByDataTest('overview__unsuccessful-description')
export const getOverviewSuccessfulDescription = () => cy.getByDataTest('overview__successful-description')
export const clickNext = () => cy.getByDataTest('bulk-invite-next').click()

export const getExistingTitle = () => cy.getByDataTest('existing-users-description')
export const getInvalidTitle = () => cy.getByDataTest('invalid-emails-description')
export const getEmailRow = () => cy.getByDataTest('email-address-table-row')
export const getEmailTable = () => cy.getByDataTest('email-address-table')
