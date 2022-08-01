import * as UsersPage from 'support/admin/pages/UsersPage'
import * as NavBar from 'support/admin/components/NavBar'
import { ADMIN_EMAIL_ADDRESS, ORGANISATION_ADMIN_EMAIL_ADDRESS } from 'support/constants'
import * as CustomSetup from 'support/CustomSetup'
import * as EditOrganisationDialog from 'support/admin/pages/EditOrganisationPage'
import * as ExpireUserDialog from 'support/admin/dialogs/ExpireUserDialog'
import * as EditUserDialog from 'support/admin/pages/EditUserPage'
import * as ConfirmExportDialog from 'support/admin/dialogs/ConfirmExportDialog'
import * as ExportInformationDialog from 'support/admin/dialogs/ExportInformationDialog'
import { generateEmailAddress } from 'support/utils'
import { toast } from 'support/common/toast'
import { v4 as uuidv4 } from 'uuid'

describe('Organisation Admin', () => {
  const orgId = uuidv4()
  CustomSetup.withOrganisationsAndUsers(
    'should let an organisation admin view their users',
    [{ id: orgId, name: 'Test Org' }],
    [
      { organisationId: orgId, role: 'ORGANISATION_ADMIN' },
      { organisationId: orgId, notes: 'super secret notes', organisationNotes: 'Just some org notes' },
      {},
    ],
    ([adminUser, orgUser, otherUser]) => {
      cy.login(adminUser.email)
      cy.visitAdmin('/users')

      UsersPage.verifyIsShown()
      NavBar.hasOrgName('Test Org')

      UsersPage.userRow(adminUser.email).exists()
      UsersPage.userRow(orgUser.email).exists()
      UsersPage.userRow(otherUser.email).notExists()

      UsersPage.userRow(orgUser.email).hasNotes('Just some org notes')
      UsersPage.column().organisation.notExists()
    }
  )

  CustomSetup.withOrganisationAdmin('should let an organisation admin edit their organisation', ({ email }) => {
    cy.login(email)
    cy.visitAdmin('/users')

    const newEmail = generateEmailAddress()
    const newDisplayName = 'new-org'

    UsersPage.verifyIsShown()
    NavBar.editOrganisation()

    EditOrganisationDialog.enterDisplayName(newDisplayName)
    EditOrganisationDialog.enterEmail(newEmail)
    EditOrganisationDialog.tickIsGoogleOrganisation()
    EditOrganisationDialog.assertNameDoesNotExist()

    EditOrganisationDialog.clickSaveChanges()

    toast.expectInfo(`${newDisplayName} has been successfully updated`)

    NavBar.hasOrgName(newDisplayName)

    NavBar.editOrganisation()
    EditOrganisationDialog.assertDisplayNameIs(newDisplayName)
    EditOrganisationDialog.assertEmailIs(newEmail)
    EditOrganisationDialog.assertIsGoogleOrganisationIsTrue()
  })

  CustomSetup.withOrganisationAdmin(
    'should let an organisation admin expire and reactivate a user',
    ({ email, organisationId }) => {
      cy.setupUser({ organisationId }).then(({ email: userToExpireEmail, preferredName: userToExpireName }) => {
        cy.login(email)
        cy.visitAdmin('/users')
        UsersPage.verifyIsShown()
        UsersPage.userRow(userToExpireEmail).statusMatches('Signed Up')

        UsersPage.actions(userToExpireEmail).expireUser()
        ExpireUserDialog.verifyIsShown()
        ExpireUserDialog.clickExpire()
        toast.expectInfo(`${userToExpireName} has been successfully expired`)

        cy.visitAdmin('/users')
        UsersPage.verifyIsShown()
        UsersPage.ensureShowExpiredCheckboxIsChecked()
        UsersPage.userRow(userToExpireEmail).statusMatches('Expired')

        UsersPage.actions(userToExpireEmail).reactivateUser()
        toast.expectInfo(`${userToExpireName} has been successfully reactivated`)
        UsersPage.userRow(userToExpireEmail).statusMatches('Signed Up')
      })
    }
  )

  CustomSetup.withOrganisationAdmin(
    'should let an organisation admin promote another user to organisation admin',
    ({ email, organisationId }) => {
      cy.setupUser({ organisationId }).then(({ email: userToEditEmail }) => {
        cy.login(email)
        cy.visitAdmin('/users')

        UsersPage.verifyIsShown()

        UsersPage.userRow(userToEditEmail).exists()

        UsersPage.role(userToEditEmail, false).organisationAdmin.verifyNot()
        UsersPage.role(userToEditEmail, false).accountManager.verifyNot()
        UsersPage.role(userToEditEmail, false).superUser.verifyNot()

        UsersPage.actions(userToEditEmail, false).editUser()
        EditUserDialog.tickAdminRole()
        EditUserDialog.submit()

        UsersPage.role(userToEditEmail, false).organisationAdmin.verifyIs()
        UsersPage.role(userToEditEmail, false).accountManager.verifyNot()
        UsersPage.role(userToEditEmail, false).superUser.verifyNot()
      })
    }
  )
})

describe('Account Admin', () => {
  CustomSetup.withAccountManger('should let an account manager see users from external accounts', ({ email }) => {
    cy.login(email)
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()
    UsersPage.ensureShowAllUsersCheckboxIsUnchecked()
    UsersPage.userRow('dumbledore@glean.co').notExists()

    UsersPage.ensureShowAllUsersCheckboxIsChecked()
    UsersPage.userRow('dumbledore@glean.co').exists()
  })
})

describe('Super Admin', () => {
  CustomSetup.withSuperUser('should let an super admin view their users', ({ email }) => {
    cy.login(email)
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()

    UsersPage.userRow(ORGANISATION_ADMIN_EMAIL_ADDRESS).exists()
    UsersPage.userRow(ADMIN_EMAIL_ADDRESS).exists()

    UsersPage.userRow('Albus Dumbledore').hasNotes('Something something important')
    UsersPage.column().organisation.exists()
  })

  it('should let a super admin export events for a user', () => {
    cy.setupUser({ role: 'SUPER_USER', bypassIntro: true }).then((superUser) => {
      cy.setupUser({ includedEvent: { eventType: 'WITH_NOTES' } }).then((eventOwnerUser) => {
        cy.login(superUser.email)
        cy.visitAdmin('/users')

        UsersPage.verifyIsShown()

        UsersPage.userRow(eventOwnerUser.email).exists()
        UsersPage.actions(eventOwnerUser.email).exportEventsForUser()

        ConfirmExportDialog.verifyIsShown()
        ConfirmExportDialog.clickExport()

        ExportInformationDialog.verifyIsShown()
        ExportInformationDialog.clickClose()

        cy.runEventExportTask()

        cy.retrieveLatestSentEmail({
          recipient: superUser.email,
          subject: 'Export link sent to ' + eventOwnerUser.email,
        })

        cy.retrieveLatestSentEmail({
          recipient: eventOwnerUser.email,
          subject: 'Your Glean export is ready',
        })
      })
    })
  })
})
