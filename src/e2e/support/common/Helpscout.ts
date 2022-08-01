export const assertPresent = () => cy.get('[data-cy="beacon-close-button"]').should('be.visible')
export const closeBeacon = () => cy.get('[data-cy="beacon-close-button"]').click()
export const assertNotPresent = () => cy.get('#beacon-container iframe').should('not.exist')
export const assertNotVisible = () => cy.get('#beacon-container iframe').should('not.be.visible')

export const killBeacon = () => {
  cy.get('.Beacon').should('exist')
  cy.killHelpscout()
}
