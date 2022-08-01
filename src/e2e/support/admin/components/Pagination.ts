export const verifyIsShown = () => cy.get('.pagination')
export const clickNextPage = () => cy.get('.pagination').first().getByDataTest('next-page').first().click()
export const verifyNextPageIsShown = () => cy.get('.pagination').first().contains('26')
