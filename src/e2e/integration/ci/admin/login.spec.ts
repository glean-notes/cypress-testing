import * as LogInForm from 'support/admin/pages/LogInForm'
import * as UsersPage from 'support/admin/pages/UsersPage'
import * as BlockedPage from 'support/admin/pages/BlockedPage'
import * as CustomSetup from 'support/CustomSetup'
import { todayMinus } from 'support/common/dateHelpers'

function loginAndVerifyUsersPageIsShown(email: string, password: string) {
  cy.visitAdmin('/users')
  LogInForm.verifyIsShown()

  LogInForm.inputEmail(email)
  LogInForm.inputPassword(password)
  LogInForm.clickLogIn()

  cy.url().should('includes', '/users')
  UsersPage.verifyIsShown()

  // Check still logged in after refresh:
  cy.reload()
  UsersPage.verifyIsShown()
}

for (let step = 0; step < 30; step++) {
  describe(`Log In ${step}`, () => {
    CustomSetup.withOrganisationAdmin('should let a user log in with correct credentials', ({ email, password }) => {
      loginAndVerifyUsersPageIsShown(email, password)
    })

    CustomSetup.withOrganisationAdmin('should not let a user log in with incorrect credentials', ({ email }) => {
      cy.visitAdmin('/')
      LogInForm.verifyIsShown()
      LogInForm.inputEmail(email)
      LogInForm.inputPassword('wrongpassword')
      LogInForm.clickLogIn()

      LogInForm.errorMessageIs('Your login details are incorrect, please try again.')
    })

    CustomSetup.withSuperUser('should not let a superuser log in with username/password', ({ email, password }) => {
      cy.visitAdmin('/')
      LogInForm.logIn(email, password)
      LogInForm.errorMessageIs('Superuser accounts must sign in with Google.')
    })

    it('should allow a user to bypass the login page if already logged in', () => {
      cy.loginAsNewAdmin()
      cy.visitAdmin('/users')
      UsersPage.verifyIsShown()
    })

    CustomSetup.withSuperUser('should handle an error communicating with the backend server', ({ email, password }) => {
      cy.visitAdmin('/')
      cy.intercept('**/login', {
        method: 'POST',
        url: '**/login',
        statusCode: 500,
        response: { code: 'server.error', message: 'Internal server error' },
      })
      LogInForm.logIn(email, password)
      LogInForm.errorMessageIs('There was a problem logging in, please try again later.')
    })

    CustomSetup.withOrganisationAdmin(
      'should let an organisation admin user log in with correct credentials',
      ({ email, password }) => {
        loginAndVerifyUsersPageIsShown(email, password)
      }
    )

    CustomSetup.withUser(
      'should show video if never viewed app before',
      { role: 'ORGANISATION_ADMIN', bypassIntro: false },
      ({ email, password }) => {
        cy.visitAdmin('/users')

        LogInForm.verifyIsShown()

        LogInForm.inputEmail(email)
        LogInForm.inputPassword(password)
        LogInForm.clickLogIn()

        cy.url().should('includes', '/intro')
      }
    )

    CustomSetup.withUser(
      'should show blocked page if expired admin tries to login',
      { role: 'ORGANISATION_ADMIN', accountExpiry: todayMinus(1) },
      (user) => {
        cy.loginUser(user)
        cy.visitAdmin('/users')
        BlockedPage.verifyIsShown()
      }
    )
  })
}