import * as InvitePage from 'support/admin/pages/InvitePage'
import * as UsersPage from 'support/admin/pages/UsersPage'
import * as Homepage from 'support/admin/pages/HomePage'
import { newEmailAddress } from 'support/utils'
import { toast } from 'support/common/toast'
import * as CustomSetup from 'support/CustomSetup'

describe('Inviting an organisation Admin ', () => {
  const inviteAndCheckAtOrganisation = (user: Cypress.User, organisation: Cypress.Organisation) => {
    cy.loginUser(user)
    cy.visitAdmin('/invite-admin')
    InvitePage.verifyAdminPageIsShown(true)

    const email = newEmailAddress()
    InvitePage.setEmail(email)
    InvitePage.setName('Test Admin Person')
    InvitePage.chooseOrganisation(organisation.id)

    InvitePage.invite()

    toast.expectInfo(`Invite email sent to ${email}`)
    cy.visitAdmin('/users')
    UsersPage.userRow(email).exists()
    UsersPage.verifyUserIsInOrganisation(email, organisation.name)
    UsersPage.role(email).organisationAdmin.verifyIs()
  }

  CustomSetup.withOrganisationsAndUsers(
    'should be possible for a super user',
    [{}],
    [{ role: 'SUPER_USER' }],
    ([user], [organisation]) => {
      inviteAndCheckAtOrganisation(user, organisation)
    }
  )

  CustomSetup.withAccountManger('should be possible for an account manager', ({ organisation, ...user }) => {
    inviteAndCheckAtOrganisation(user, organisation)
  })

  CustomSetup.withUserAtOrganisation(
    'should be possible for an organisation admin',
    { role: 'ORGANISATION_ADMIN' },
    (user) => {
      cy.loginUser(user)
      cy.visitAdmin('/invite-admin')
      InvitePage.verifyAdminPageIsShown(false)

      const email = newEmailAddress()
      InvitePage.setEmail(email)
      InvitePage.setName('Test Admin Person')

      InvitePage.invite()

      toast.expectInfo(`Invite email sent to ${email}`)
      cy.visitAdmin('/users')
      UsersPage.userRow(email).exists()
      UsersPage.role(email).organisationAdmin.verifyIs()
    }
  )

  CustomSetup.withLimitedAccessAdmin('should not be possible for an atsp', ({ email }) => {
    cy.login(email)
    cy.visitAdmin('/invite-admin')
    Homepage.verifyIsShown()
  })
})
