export const logOut = () => cy.getByDataTest('log-out-menu-item').click()
export const clickHelp = () => cy.getByDataTest('HelpDropdownItems.helpDropdownItem').click()
export const clickGetInTouch = () => cy.getByDataTest('HelpDropdownItems.getInTouchDropdownItem').click()
export const clickIntro = () => intro().click()
export const intro = () => cy.getByDataTest('HelpDropdownItems.introDropdownItem')

export const clickProfileDropdown = () => cy.getByDataTest('user-profile').click()
export const clickHelpDropdown = () => cy.getByDataTest('HelpDropdown.helpMenu').click()
export const users = () => cy.getByDataTest('users').click()

export const hasOrgName = (name: string) => cy.getByDataTest('organisation-name').contains(name)
export const editOrganisation = () => cy.getByDataTest('organisation-name').click()
