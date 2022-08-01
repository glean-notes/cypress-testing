const clickDropdownSearch = (testId?: string, index: number = 0) => {
  if (testId) {
    cy.getByDataTest(testId).find('.dropdown-container').eq(index).trigger('click')
  } else {
    cy.get('.dropdown-container').eq(index).trigger('click')
  }
}

export const selectDropdownItem = (
  forceBlur: () => void,
  testId: string | undefined,
  search: string,
  index: number = 0
) => {
  clickDropdownSearch(testId, index)
  cy.focused().type(search)
  cy.get('.select-item').should('have.length', 1)
  cy.contains(search).trigger('click')
  cy.get('.search-clear-button').click()
  forceBlur()
}
