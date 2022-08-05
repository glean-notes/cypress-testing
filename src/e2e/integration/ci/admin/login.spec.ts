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

for (let step = 1; step <= 200; step++) {
  describe(`Log In ${step}`, () => {
    CustomSetup.withOrganisationAdmin('should let a user log in with correct credentials', ({ email, password }) => {
      loginAndVerifyUsersPageIsShown(email, password)
    })
  })
}