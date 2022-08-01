class PageNotFound {
  public getLost = () => cy.visit('/squanch')

  public verifyIsShown = () => cy.contains('Yikes! The note-orious 404')

  public goToEventsList = () => {
    this.getTestElement('toList').should('be.visible')

    // Use force: true as workaround to requery issue, see https://github.com/cypress-io/cypress/issues/7306
    this.getTestElement('toList').click({ force: true })
  }

  private getTestElement = (name: string) => cy.getByDataTest(name)
}

export default new PageNotFound()
