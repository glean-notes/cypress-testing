const backButton = () => cy.getByDataTest('returnToAllCollections')

export const verifyIsLoaded = () => backButton()

export const clickBackButton = () => backButton().click()

export const clickNewEvent = () => cy.getByDataTest('newEventButton').click()

const getInputField = () => cy.getByDataTest('CollectionName.textInputField')

export const enterCollectionName = (name: string) => getInputField().focus().should('have.focus').type(name)

export const assertCollectionName = (name: string) => getInputField().focus().should('have.value', name)

export const assertEventWithTitleExists = (title: string) => {
  cy.get('.events-table').within(() => cy.contains(title))
}

export const clickDropdownDeleteCollection = () =>
  cy.get('.collection-options').click().get('.dropdown-menu--active').contains('Delete Collection').click()

export const clickDeleteCollectionPopupButton = () => cy.getByDataTest('deleteCollectionPopupButton').click()
