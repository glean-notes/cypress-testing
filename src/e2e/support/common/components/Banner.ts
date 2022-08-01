const banner = () => cy.get('.banner')

export const verifyIsShown = banner
export const verifyNotShown = () => banner().should('not.exist')

export const hasText = (text: string) => banner().should('include.text', text)
export const hasColour = (colour: string) => banner().should('have.class', `banner--${colour}`)

export const clickRenewButton = () => cy.getByDataTest('renew').click()
export const clickCloseBanner = () => cy.getByDataTest('close-banner').click()
