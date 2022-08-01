import * as UsersPage from 'support/admin/pages/UsersPage'
import * as InvitePage from 'support/admin/pages/InvitePage'
import * as EditOrganisationPage from 'support/admin/pages/EditOrganisationPage'
import * as OrganisationsPage from 'support/admin/pages/OrganisationsPage'
import * as CustomSetup from 'support/CustomSetup'
import { newEmailAddress } from 'support/utils'
import { toast } from 'support/common/toast'
import { v4 as uuidv4 } from 'uuid'

describe('Invite User - Organisation Admin', () => {
  const orgId = uuidv4()
  CustomSetup.withOrganisationsAndUsers(
    'should show error when email address already used in their organisation',
    [{ id: orgId }],
    [{ organisationId: orgId, role: 'ORGANISATION_ADMIN' }, { organisationId: orgId }],
    ([adminUser, user]) => {
      cy.loginUser(adminUser)
      cy.visitAdmin('/users')
      UsersPage.verifyIsShown()
      UsersPage.inviteUser()
      InvitePage.inviteUser(user.email, user.preferredName)
      toast.expectError('This user already exists in your organization.')
    }
  )

  it('should show error when email address already invited in their organisation', () => {
    cy.loginAsNewAdmin()
    cy.visitAdmin('/users')
    UsersPage.verifyIsShown()
    UsersPage.inviteUser()
    const email = newEmailAddress()

    InvitePage.inviteUser(email, 'Test Person')
    toast.expectInfo(`Invite email sent to ${email}`)

    InvitePage.inviteUser(email, 'Test Person')
    toast.expectError('This user already exists in your organization.')
  })

  it('should invite user when email address already used but not in their organisation (and user is not already in an organisation)', () => {
    cy.setupUser({ subscriptionType: 'SONOCENT_MANAGED' }).then(({ email }) => {
      cy.loginAsNewAdmin()
      cy.visitAdmin('/users')
      UsersPage.verifyIsShown()
      UsersPage.inviteUser()

      InvitePage.setEmail(email)
      InvitePage.setName('Test Person')
      InvitePage.invite()
      toast.expectInfo(`Invite email sent to ${email}`)

      InvitePage.cancel()
      UsersPage.userRow(email).exists()
    })
  })

  it('should resend an invitation', () => {
    cy.loginAsNewAdmin()
    cy.visitAdmin('/users')
    UsersPage.verifyIsShown()
    UsersPage.inviteUser()
    const email = newEmailAddress()

    InvitePage.setEmail(email)
    InvitePage.setName('Test Person')
    InvitePage.invite()
    toast.expectInfo(`Invite email sent to ${email}`)
    toast.close()
    InvitePage.cancel()

    UsersPage.actions(email).resendInvitation()

    toast.expectInfo(`Invitation email sent to ${email}.`)
  })

  it('should handle creating users with a limit', () => {
    cy.setupUser({ role: 'ORGANISATION_ADMIN' }).then(({ email: organisationAdminEmail, organisationId }) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/organisations')

      OrganisationsPage.editOrganisation(organisationId!, `${organisationId} generated organisation`)
      EditOrganisationPage.enterUserLimit(1)
      EditOrganisationPage.clickSaveChanges()
      OrganisationsPage.verifyIsShown()

      cy.logout()

      cy.login(organisationAdminEmail)
      cy.visitAdmin('/users')

      UsersPage.inviteUser()

      InvitePage.limitIs('Invites Remaining: 1')

      const email = newEmailAddress()
      InvitePage.setEmail(email)
      InvitePage.setName('Test Person')
      InvitePage.invite()

      InvitePage.limitIsNotShown()
      InvitePage.userLimitReached()
    })
  })
})
