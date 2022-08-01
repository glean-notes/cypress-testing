import * as LogInForm from 'support/admin/pages/LogInForm'
import * as UsersPage from 'support/admin/pages/UsersPage'
import * as IntroPage from 'support/admin/pages/IntroPage'
import * as NavBar from 'support/admin/components/NavBar'
import * as Helpscout from 'support/common/Helpscout'

describe('Navbar', () => {
  beforeEach(() => {
    cy.loginAsNewAdmin()
    cy.visitAdmin('/users')
    UsersPage.verifyIsShown()
  })

  it('should let a user log out', () => {
    cy.intercept('POST', '**/logout').as('logout')

    NavBar.clickProfileDropdown()
    NavBar.logOut()
    cy.wait('@logout')
    LogInForm.verifyIsShown()

    cy.visitAdmin('/users')
    LogInForm.verifyIsShown()
  })

  it('should let a user request help and get in touch', () => {
    NavBar.clickHelpDropdown()
    NavBar.clickHelp()

    Helpscout.assertPresent()
    Helpscout.closeBeacon()

    NavBar.clickHelpDropdown()
    NavBar.clickGetInTouch()

    Helpscout.assertPresent()
  })

  it('should let a user view a video', () => {
    NavBar.clickHelpDropdown()
    NavBar.clickIntro()

    IntroPage.verifyIsShown()
  })
})
