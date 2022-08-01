import * as UsersPage from 'support/admin/pages/UsersPage'
import * as CustomSetup from 'support/CustomSetup'
import * as InvitePage from 'support/admin/pages/InvitePage'
import * as NavBar from 'support/admin/components/NavBar'
import * as HomePage from 'support/admin/pages/HomePage'
import { newEmailAddress } from 'support/utils'
import { toast } from 'support/common/toast'

describe('atsp users', () => {
  CustomSetup.withLimitedAccessAdmin('should invite users which have an account expiry date', ({ email }) => {
    cy.login(email)
    cy.visitAdmin('/users')
    UsersPage.verifyIsShown()
    UsersPage.inviteUser()

    const newUserEmail = newEmailAddress()

    InvitePage.setEmail(newUserEmail)
    InvitePage.setName('Test Person')
    InvitePage.invite()

    toast.expectInfo(`Invite email sent to ${newUserEmail}`)

    InvitePage.cancel()

    UsersPage.userRow(newUserEmail).exists()

    UsersPage.column().countIs(6)
    UsersPage.column().name.exists()
    UsersPage.column().email.exists()
    UsersPage.column().notes.exists()
    UsersPage.column().expires.exists()

    UsersPage.dsaLabel(newUserEmail).should('not.exist')

    UsersPage.userRow(newUserEmail).accountExpiryMatches(/\w+ \d{1,2}\w{2} \d{4}/)
  })

  CustomSetup.withLimitedAccessAdmin('should resend an invitation', ({ email: atspEmail }) => {
    cy.login(atspEmail)

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

  CustomSetup.withLimitedAccessAdmin('should have restricted access', ({ email }) => {
    cy.login(email)

    cy.visitAdmin('/')
    HomePage.verifyIsShown()

    cy.visitAdmin('/users')
    UsersPage.verifyIsShown()
    UsersPage.showExpiredCheckbox().should('exist')

    // Can't view orgs
    cy.visitAdmin('/organisations')
    HomePage.verifyIsShown()

    // Can't view intro video
    cy.visitAdmin('/intro')
    HomePage.verifyIsShown()

    NavBar.clickProfileDropdown()
    NavBar.intro().should('not.exist')
  })
})
