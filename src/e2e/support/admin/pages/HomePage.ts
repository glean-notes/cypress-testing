export const verifyIsShown = () => cy.getByDataTest('home-page')

export const clickHelpDropdown = () => cy.getByDataTest('HelpDropdown.helpMenu').click()
