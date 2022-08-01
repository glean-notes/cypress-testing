const searchBar = () => cy.getByDataTest('search')

export const search = (query: string) => searchBar().focus().clear().paste(query)
export const blur = () => searchBar().focus().blur()
