export const verifyIsShown = () => cy.get('.slide-in-panel')
export const verifyIsNotShown = () => cy.get('.slide-in-panel').should('not.exist')

export const enterSearchQuery = (query: string) =>
  cy.get('.search-panel__search').focus().should('have.focus').type(query)

export const blur = () => cy.get('.search-panel__search').blur()

export const assertSearchQuery = (query: string) => cy.get('.search-panel__search').should('have.value', query)

export const assertNoResultsFound = () => cy.getByDataTest('search-panel-no-results').should('be.visible')

export const assertCollectionSearchResult = (collectionName: string) => {
  cy.get('.search-panel__content > .search-panel-results__title').should('have.text', 'Collections')
  cy.get('.search-panel-results__link').should('have.text', collectionName)
}

export const assertEventSearchResult = (eventName: string) => {
  cy.get('.search-panel__content > .search-panel-results__title').should('have.text', 'Events')
  cy.get('.search-panel-results__link').should('have.text', eventName)
}

export const assertNoteSearchResult = (noteName: string) => {
  cy.get('.search-panel__content > .search-panel-results__title').should('have.text', 'Notes')
  cy.get('.search-result-notes__link').should('have.text', noteName)
}

export const selectSearchResult = (searchResult: string) =>
  cy.get('.search-panel-results__link').within(() => {
    cy.contains(searchResult).click()
  })

export const selectNoteSearchResult = (searchResult: string) =>
  cy.get('.search-panel-results__sublist').within(() => {
    cy.contains(searchResult).click()
  })

export const clickClearSearchButton = () => cy.get('.search-panel__close').click()
