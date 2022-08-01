import { blur } from 'support/utils'

export const DEFINITION_DISAMBIGUATION_SELECTOR = '[data-test="modal-content"] #definitionPicker'

export const open = () => cy.getByDataTest('definitionCardButton').click()
export const close = () => cy.getByDataTest('close-modal').click()

export const search = (query: string) => {
  input().type(query)
  cy.getByDataTest('DefinitionModal.searchButton').click()
}

export const clear = () => cy.getByDataTest('DefinitionModal.noMatch').click()

export const withBlurredDisambiguation = () => blur(cy.get(DEFINITION_DISAMBIGUATION_SELECTOR))

export const withBlurredSearch = () => blur(input())

export const expectNoResults = () => cy.getByDataTest('DefinitionModal.noMatch').should('exist')

export const expectDisambiguation = () => cy.get(DEFINITION_DISAMBIGUATION_SELECTOR).should('exist')

export const selectFirstDisambiguation = () =>
  cy.get(`${DEFINITION_DISAMBIGUATION_SELECTOR} option:first-child`).click()

export const selectDisambiguation = (option: string) => cy.get(DEFINITION_DISAMBIGUATION_SELECTOR).select(option)

const input = () => cy.getByDataTest('DefinitionModal.input')
