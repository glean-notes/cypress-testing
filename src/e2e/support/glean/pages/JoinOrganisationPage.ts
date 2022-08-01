export const isLoaded = () => cy.get('.join-organisation-invite')

export const join = () => cy.getByDataTest('join-account').click()
export const doNotJoin = () => cy.getByDataTest('do-not-join-account').click()

export const declinePage = () => cy.get('.join-organisation-decline')
export const acceptPage = () => cy.get('.join-organisation-accept')
export const goToGlean = () => cy.getByDataTest('go-to-glean').click()
