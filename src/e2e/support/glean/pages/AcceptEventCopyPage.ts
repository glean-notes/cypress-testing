export const getPage = () => cy.getByDataTest('AcceptEventCopyPage')

export const verifyIsLoaded = () => {
  getPage()
  cy.getByDataTest('loading-accept-event-copy-loader').should('not.exist')
}

export const clickBackToGleanButton = () => cy.getByDataTest('AcceptEventCopyPage.backButton').click()

export const verifyExpiredLinkErrorShown = () => getPage().contains('This Event link has been used or has expired.')
export const verifyPermissionsErrorShown = () => getPage().contains("You don't have permission to receive this Event")

export const clickGoToEventButton = () => cy.getByDataTest('AcceptEventCopyPage.openEventButton').click()
