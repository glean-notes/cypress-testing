import * as UsersPage from '../admin/pages/UsersPage'
import * as InvitePage from '../admin/pages/InvitePage'
import { toast } from '../common/toast'

export const TEST_USER_NAME = 'Test Person'

export const inviteUserInAdmin = (email: string, orgName?: string, orgEmail?: string) => {
  cy.createOrganisations([{ name: orgName, email: orgEmail }]).then(([{ id: orgId }]) => {
    cy.setupUser({ organisationId: orgId, role: 'ORGANISATION_ADMIN', bypassIntro: true }).then(
      ({ email: inviterEmail }) => {
        cy.login(inviterEmail)
        cy.visit(`${Cypress.env('ADMIN_URL')}/users`)

        UsersPage.verifyIsShown()
        UsersPage.inviteUser()

        completeInvite(email)
      }
    )
  })
}

export const inviteOrgAdminUserInAdmin = (email: string) => {
  cy.setupUser({ role: 'ORGANISATION_ADMIN', bypassIntro: true }).then(({ email: inviterEmail }) => {
    cy.login(inviterEmail)
    cy.visit(`${Cypress.env('ADMIN_URL')}/users`)

    UsersPage.verifyIsShown()
    UsersPage.inviteUser()

    InvitePage.tickMakeAdministrator()

    completeInvite(email, true)
  })
}

const completeInvite = (email: string, invitingAdmin: boolean = false) => {
  InvitePage.setEmail(email)
  InvitePage.setName(TEST_USER_NAME)
  InvitePage.invite()
  if (invitingAdmin) {
    InvitePage.acceptAdminRoleModal()
  }
  toast.expectInfo(`Invite email sent to ${email}`)
  InvitePage.cancel()
  UsersPage.userRow(email).exists()
}
