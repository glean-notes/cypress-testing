export const assertPresent = () => cy.get('[data-cy="beacon-close-button"]').should('be.visible')
export const closeBeacon = () => cy.get('[data-cy="beacon-close-button"]').click()
