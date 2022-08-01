export const waitUntilCompleted = () => {
  cy.get('.glean-loader').should('not.exist')
}
