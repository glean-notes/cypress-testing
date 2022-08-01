const IMAGE_BUTTON_SELECTOR = 'imageButton'
const IMAGE_SEARCH_DIALOG_SELECTOR = 'ImageSearchModal.modal'
const UPLOAD_BUTTON_SELECTOR = 'ImageSearchModal.import'
const HIDDEN_FILE_INPUT_SELECTOR = 'ImageSearchModal.fileInput'
const IMAGE_SEARCH_SELECTOR = 'ImageSearchModal.input'
const IMAGE_SEARCH_BUTTON_SELECTOR = 'ImageSearchModal.searchButton'
const SEARCH_RESULT_SELECTOR = '.image-search-result'
const SHOW_MORE_BUTTON_SELECTOR = '.image-search-results__see-more-button'
const CLEAR_BUTTON_SELECTOR = 'ClearSearch.clearButton'

export const open = () => cy.getByDataTest(IMAGE_BUTTON_SELECTOR).click()
export const close = () => cy.getByDataTest('close-modal').click()

export const isOpen = () => cy.getByDataTest(IMAGE_SEARCH_DIALOG_SELECTOR).should('exist')

export const isClosed = () => cy.getByDataTest(IMAGE_SEARCH_DIALOG_SELECTOR).should('not.exist')

export const upload = () => {
  cy.getByDataTest(UPLOAD_BUTTON_SELECTOR).click()

  cy.fixture('test.jpeg', 'base64').then((fileContent) => {
    cy.getByDataTest(HIDDEN_FILE_INPUT_SELECTOR).upload({
      fileContent,
      fileName: 'test.jpeg',
      mimeType: 'image/jpeg',
      encoding: 'base64',
    })
  })
}

export const search = (query: string) => {
  cy.getByDataTest(IMAGE_SEARCH_SELECTOR).type(query)
  cy.getByDataTest(IMAGE_SEARCH_BUTTON_SELECTOR).click()
}

export const clear = () => cy.getByDataTest(CLEAR_BUTTON_SELECTOR).click({ force: true })

export const expectResults = (count?: number) => cy.get(SEARCH_RESULT_SELECTOR).should('have.length', count)
export const expectResultsInRegionOf = (min: number, max: number) => {
  cy.get(SEARCH_RESULT_SELECTOR).should('have.length.at.least', min)
  cy.get(SEARCH_RESULT_SELECTOR).should('have.length.at.most', max)
}

export const clickMore = () => cy.get(SHOW_MORE_BUTTON_SELECTOR).scrollIntoView().click()

export const postFirst = () =>
  cy
    .get(`${SEARCH_RESULT_SELECTOR}:first-child .image-search-result__button`)
    .should('not.be.disabled')
    .click({ force: true })
