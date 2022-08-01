import * as CustomSetup from '../../../support/CustomSetup'
import * as LogInForm from '../../../support/admin/pages/LogInForm'

CustomSetup.withOrganisationAdmin('should show user changed dialog when userId cookie changes', (secondAdmin) => {
  cy.loginAsNewAdmin().then(() => cy.visitAdmin('/users'))

  cy.loginUser(secondAdmin).then(() =>
    cy.getByDataTest('user-changed-content').should('contain', `You are now logged in as ${secondAdmin.email}`)
  )
})

CustomSetup.withDefaultUser('should take you to login page when userId cookie changes to non admin user', (user) => {
  cy.loginAsNewAdmin().then(() => cy.visitAdmin('/users'))

  cy.loginUser(user).then(() => {
    LogInForm.verifyIsShown()
    LogInForm.errorMessageIs('Unauthorised')
  })
})
