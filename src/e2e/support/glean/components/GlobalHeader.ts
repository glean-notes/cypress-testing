export const clickHelpMenu = () => cy.getByDataTest('helpMenu').click()
export const clickProfileMenu = () => {
  cy.getByDataTest('user-profile').click()
  cy.getByDataTest('dropdownMenu').should('be.visible')
}

export const clickLogOut = () => {
  clickProfileMenu()
  cy.getByDataTest('log-out-menu-item').click()
}

export const clickGetInTouch = () => cy.getByDataTest('get-in-touch-menu-item').click()
export const clickHelp = () => cy.getByDataTest('help-menu-item').click()
export const clickDownloadDemoEvent = () => cy.getByDataTest('demo-event-menu-item').click()
export const clickShortcuts = () => cy.getByDataTest('shortcuts-menu-item').click()

export const eventUploadIndicator = () => cy.get('.status-indicator__icon--uploading')
export const waitUntilAllUploaded = () => cy.get('.status-indicator__icon--online')

export const rainbowButton = () => cy.get('.global-header__colour-changer-icon')

export const assertBackgroundColorNot = (color: string) => {
  cy.get('.global-header').should('have.css', 'background-color').and('not.eq', color)
}

export const clickIntroVideo = () => cy.getByDataTest('intro-menu-item').click()

export const profile = () => cy.getByDataTest('profile')

export const clickFreeUpSpace = () => {
  clickProfileMenu()
  cy.getByDataTest('free-up-space-menu-item').click()
}
