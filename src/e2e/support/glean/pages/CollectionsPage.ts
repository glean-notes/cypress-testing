import * as CollectionPage from './CollectionPage'

export const verifyIsLoaded = () => cy.get('.collections-panel')

export const visitCollections = () => {
  cy.visit('/events/collections')
  verifyIsLoaded()
}

export const loginAndVisitCollectionsPage = (username: string) => {
  cy.login(username)
  visitCollections()
}

export const logInAndCreateCollection = (username: string) => {
  loginAndVisitCollectionsPage(username)
  clickNewCollection()
  CollectionPage.verifyIsLoaded()
}

export const verifyPlaceholderShown = () => cy.get('.collections-placeholder')

export const clickNewCollection = () => cy.getByDataTest('newCollectionButton').click()

export const assertCollectionWithTitleExists = (title: string) => {
  cy.get('.collections-panel__grid').within(() => cy.contains(title))
}

export const clickNewEventOnCollection = () => cy.get('.collections-item__add-event').click()
