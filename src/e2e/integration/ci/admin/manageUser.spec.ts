import * as DeleteUserDialog from 'support/admin/dialogs/DeleteUserDialog'
import * as ExpireUserDialog from 'support/admin/dialogs/ExpireUserDialog'
import * as EditUserPage from 'support/admin/pages/EditUserPage'
import * as UsersPage from 'support/admin/pages/UsersPage'
import * as SearchBar from 'support/admin/components/SearchBar'
import * as CustomSetup from 'support/CustomSetup'
import { generateEmailAddress } from 'support/utils'

describe('User management', () => {
  CustomSetup.withOrganisationsAndUsers(
    "should be able to edit a user's organisation",
    [{}],
    [{}],
    ([user], [organisation]) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/users')

      UsersPage.verifyIsShown()
      UsersPage.ensureShowExpiredCheckboxIsChecked()

      UsersPage.actions(user.email).editUser()
      EditUserPage.assertEditUser()
      EditUserPage.chooseOrganisation(organisation.id)
      EditUserPage.submit()

      UsersPage.verifyUserIsInOrganisation(user.email, organisation.name)

      UsersPage.actions(user.email).editUser()
      EditUserPage.removeOrganisation()
      EditUserPage.submit()

      UsersPage.verifyUserIsInOrganisation(user.email)
    }
  )

  CustomSetup.withDefaultUser("should be able to edit a user's expiry", ({ email }) => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()

    UsersPage.actions(email).editUser()
    EditUserPage.editExpiry('04/21/2200')
    EditUserPage.submit()

    UsersPage.userRow(email).accountExpiryMatches(/April 21st 2200/)
  })

  CustomSetup.withDefaultUser("should be able to edit a user's email", ({ email }) => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()

    UsersPage.actions(email).editUser()
    const newEmail = generateEmailAddress()
    EditUserPage.editEmail(newEmail)
    EditUserPage.submit()

    UsersPage.userRow(newEmail).exists()
  })

  CustomSetup.withOrganisationsAndUsers(
    "should be able to edit a user's organisation to atsp",
    [{ subscriptionType: 'DISTRIBUTOR', adminAccessType: 'LIMITED', labels: ['DSA'] }],
    [{}],
    ([user], [organisation]) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/users')

      UsersPage.verifyIsShown()
      SearchBar.search(user.email)
      UsersPage.dsaLabel(user.email).should('not.exist')

      UsersPage.actions(user.email).editUser()
      EditUserPage.chooseOrganisation(organisation.id)
      EditUserPage.submit()

      UsersPage.verifyUserIsInOrganisation(user.email, organisation.name)
      UsersPage.dsaLabel(user.email).should('exist')
    }
  )

  CustomSetup.withOrganisationsAndUsers(
    "should be able to edit a trial user's organisation",
    [{}],
    [{ subscriptionType: 'TRIAL', accountExpiry: new Date() }],
    ([user], [organisation]) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/users')

      UsersPage.verifyIsShown()
      UsersPage.ensureShowExpiredCheckboxIsChecked()
      SearchBar.search(user.email)
      UsersPage.trialLabel(user.email, false).should('exist')

      UsersPage.actions(user.email).editUser()
      EditUserPage.chooseOrganisation(organisation.id)
      EditUserPage.submit()

      SearchBar.search(user.email)
      UsersPage.trialLabel(user.email, false).should('not.exist')
      UsersPage.verifyUserIsInOrganisation(user.email, organisation.name)
      UsersPage.userRow(user.email).statusMatches('Signed Up')
      UsersPage.userRow(user.email).accountExpiryIsEmpty()
    }
  )

  CustomSetup.withOrganisationAdmin('should allow user deletion with confirmation', ({ email }) => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/users')
    UsersPage.verifyIsShown()

    UsersPage.actions(email).deleteUser()

    DeleteUserDialog.verifyIsShown()
    DeleteUserDialog.clickDelete()

    UsersPage.userRow(email).notExists()

    cy.visitAdmin('/users')
    UsersPage.verifyIsShown()
    UsersPage.userRow(email).notExists()
  })

  CustomSetup.withUser('should be able to edit a user note', { role: 'ORGANISATION_ADMIN' }, (user) => {
    const name = user.preferredName
    const value1 = 'Hello World!'
    const value2 = 'Goodbye World!'

    cy.loginAsNewSuperuser()
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()

    SearchBar.search(name)
    UsersPage.setUserNote(name, value1)
    UsersPage.assertUserNote(name, value1)

    UsersPage.setUserNote(name, value2)
    UsersPage.assertUserNote(name, value2)
  })

  CustomSetup.withUserAtOrganisation('should be able to promote and demote users roles', {}, ({ email }) => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()

    SearchBar.search(email)

    UsersPage.role(email, false).organisationAdmin.verifyNot()
    UsersPage.role(email, false).accountManager.verifyNot()
    UsersPage.role(email, false).superUser.verifyNot()

    // Org admin
    UsersPage.actions(email, false).editUser()
    EditUserPage.chooseRole().organisationAdmin()
    EditUserPage.submit()

    SearchBar.search(email)
    UsersPage.role(email, false).organisationAdmin.verifyIs()
    UsersPage.role(email, false).accountManager.verifyNot()
    UsersPage.role(email, false).superUser.verifyNot()

    // Super User
    UsersPage.actions(email, false).editUser()
    EditUserPage.chooseRole().superUser()
    EditUserPage.submit()

    SearchBar.search(email)
    UsersPage.role(email, false).organisationAdmin.verifyNot()
    UsersPage.role(email, false).accountManager.verifyNot()
    UsersPage.role(email, false).superUser.verifyIs()

    // Account Manager
    UsersPage.actions(email, false).editUser()
    EditUserPage.chooseRole().accountManager()
    EditUserPage.submit()

    SearchBar.search(email)
    UsersPage.role(email, false).organisationAdmin.verifyNot()
    UsersPage.role(email, false).accountManager.verifyIs()
    UsersPage.role(email, false).superUser.verifyNot()

    // None
    UsersPage.actions(email, false).editUser()
    EditUserPage.removeRole()
    EditUserPage.submit()

    SearchBar.search(email)
    UsersPage.role(email, false).organisationAdmin.verifyNot()
    UsersPage.role(email, false).accountManager.verifyNot()
    UsersPage.role(email, false).superUser.verifyNot()
  })

  CustomSetup.withDefaultUser('should be able to expire and reactivate user', ({ email }) => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()
    UsersPage.ensureShowExpiredCheckboxIsChecked()
    UsersPage.userRow(email).statusMatches('Signed Up')

    UsersPage.actions(email).expireUser()
    ExpireUserDialog.verifyIsShown()
    ExpireUserDialog.clickExpire()

    UsersPage.userRow(email).statusMatches('Expired')

    UsersPage.actions(email).reactivateUser()
    UsersPage.userRow(email).statusMatches('Signed Up')
  })
})
