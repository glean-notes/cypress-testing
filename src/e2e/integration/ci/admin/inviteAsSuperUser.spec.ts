import * as InvitePage from '../../../support/admin/pages/InvitePage'
import * as UsersPage from '../../../support/admin/pages/UsersPage'
import { generateEmailAddress, newEmailAddress } from '../../../support/utils'
import { toast } from '../../../support/common/toast'
import * as CustomSetup from '../../../support/CustomSetup'
import * as EditUserPage from '../../../support/admin/pages/EditUserPage'
import * as BulkInviteBreakdown from '../../../support/admin/dialogs/BulkInviteBreakdown'

interface Invite {
  email: string
  name?: string
  notes?: string
  expiry?: string
  role?: string
}

const makeInvites = (users: Invite[]) =>
  `Email,Name (optional),Notes (optional),Expiration Date (optional) (format: mm/dd/yyyy),Role (optional)
  ${users.map((u) => `${u.email},${u.name ?? ''},${u.notes ?? ''},${u.expiry ?? ''},${u.role ?? ''}`).join('\n')}`

describe('Invite User - Super User', () => {
  const setAccountManagerAndInviteUser = (email: string, name: string) => {
    InvitePage.setEmail(email)
    InvitePage.setName(name)
    InvitePage.setExpiry('04/21/2200')
    InvitePage.chooseRole().accountManager()
    InvitePage.invite()
  }

  beforeEach(() => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/users')

    UsersPage.verifyIsShown()
    UsersPage.inviteUser()
  })

  it('should create a new invitation', () => {
    const email = newEmailAddress()
    const name = 'Test Person'

    setAccountManagerAndInviteUser(email, name)
    toast.expectInfo(`Invite email sent to ${email}`)

    InvitePage.cancel()

    UsersPage.userRow(email).exists()
    UsersPage.userRow(email).accountExpiryMatches(/April 21st 2200/)
  })

  it('should create a new invitation to distributor organisation', () => {
    cy.createOrganisation({ subscriptionType: 'DISTRIBUTOR', adminAccessType: 'LIMITED', labels: ['DSA'] }).then(
      (organisation) => {
        cy.reload()
        InvitePage.verifyIsShown()
        const email = newEmailAddress()

        InvitePage.setEmail(email)
        InvitePage.chooseOrganisation(organisation.id)
        InvitePage.invite()
        toast.expectInfo(`Invite email sent to ${email}`)

        InvitePage.cancel()

        UsersPage.userRow(email).exists()
      }
    )
  })

  it('should create a new invitation to institution organisation', () => {
    cy.createOrganisation({ subscriptionType: 'INSTITUTION' }).then((organisation) => {
      cy.reload()
      InvitePage.verifyIsShown()
      const email = newEmailAddress()

      InvitePage.setEmail(email)
      InvitePage.chooseOrganisation(organisation.id)
      InvitePage.invite()
      toast.expectInfo(`Invite email sent to ${email}`)

      InvitePage.cancel()

      UsersPage.userRow(email).exists()
    })
  })

  CustomSetup.withUserAtOrganisation(
    'should error if inviting an admin already invited',
    { role: 'ORGANISATION_ADMIN' },
    (userToInvite) => {
      setAccountManagerAndInviteUser(userToInvite.email, userToInvite.preferredName)
      toast.expectError('Please contact help@glean.co to discuss adding this user.')
    }
  )

  it('should delete an invitation', () => {
    const email = newEmailAddress()
    const name = 'Delete Invitation Test'

    setAccountManagerAndInviteUser(email, name)
    toast.expectInfo(`Invite email sent to ${email}`)
    toast.close()
    InvitePage.cancel()

    UsersPage.actions(email).deleteInvitation()

    toast.expectInfo(`Invitation for ${name} has been deleted`)
    UsersPage.userRow(email).notExists()
  })

  it('should withdraw an invitation', () => {
    const email = newEmailAddress()
    const name = 'Withdrawn Invitation Test'

    setAccountManagerAndInviteUser(email, name)
    toast.expectInfo(`Invite email sent to ${email}`)
    toast.close()
    InvitePage.cancel()

    UsersPage.actions(email).withdrawInvitation()
    UsersPage.ensureShowExpiredCheckboxIsChecked()

    toast.expectInfo(`Invitation for ${name} has been withdrawn`)
    UsersPage.userRow(email).statusMatches('Invite Withdrawn')
  })

  it('should edit an invitations expiry', () => {
    const email = newEmailAddress()
    const name = 'Edit Invitation Test'

    setAccountManagerAndInviteUser(email, name)
    toast.expectInfo(`Invite email sent to ${email}`)
    toast.close()
    InvitePage.cancel()

    UsersPage.actions(email).editInvite()
    EditUserPage.assertEditInvite()
    EditUserPage.editExpiry('04/21/2200')
    EditUserPage.submit()

    UsersPage.userRow(email).accountExpiryMatches(/April 21st 2200/)
  })

  CustomSetup.withUserAtOrganisation('should allow bulk invites', {}, (existingUser) => {
    cy.reload()
    InvitePage.selectBulkInviteTab()
    const inviteOne = {
      email: generateEmailAddress(),
      name: 'user one',
      notes: 'notes',
    }

    const inviteTwo = {
      email: generateEmailAddress(),
      name: 'user two',
    }

    const inviteThree = {
      email: generateEmailAddress(),
    }

    const inviteFour = {
      email: generateEmailAddress(),
      expiry: '01/01/2200',
    }

    const inviteFive = {
      email: generateEmailAddress(),
      role: 'organisation admin',
    }

    const existingUserInvite = {
      email: existingUser.email,
      expiry: '01/01/2200',
    }

    const invalidEmail = 'invalid-email'
    const invalidEmailInvite = {
      email: invalidEmail,
      expiry: '01/01/2200',
    }

    const invites = makeInvites([
      inviteOne,
      inviteTwo,
      inviteThree,
      inviteFour,
      inviteFive,
      existingUserInvite,
      invalidEmailInvite,
    ])

    InvitePage.chooseOrganisation(existingUser.organisationId)

    InvitePage.bulkUpload(invites)

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500) // wait for file to upload

    InvitePage.invite()
    BulkInviteBreakdown.verifyIsShown()

    BulkInviteBreakdown.getOverviewEmailsFoundDescription().should(
      'have.text',
      '7 records found in file: bulk-invite.csv'
    )

    BulkInviteBreakdown.getEmailTable().should('contain', inviteOne.email)
    BulkInviteBreakdown.getEmailTable().should('contain', inviteTwo.email)
    BulkInviteBreakdown.getEmailTable().should('contain', inviteThree.email)
    BulkInviteBreakdown.getEmailTable().should('contain', inviteFour.email)
    BulkInviteBreakdown.getEmailTable().should('contain', inviteFive.email)

    BulkInviteBreakdown.getOverviewUnsuccessfulDescription().should(
      'have.text',
      'Invites not sent to 2 users. Click Next for details.'
    )
    BulkInviteBreakdown.getOverviewSuccessfulDescription().should('have.text', 'Invites sent to the following 5 users:')
    BulkInviteBreakdown.clickNext()

    BulkInviteBreakdown.getExistingTitle().should('have.text', '1 user has already signed up:')
    BulkInviteBreakdown.getEmailRow().should('have.text', existingUser.email)

    BulkInviteBreakdown.clickNext()

    BulkInviteBreakdown.getInvalidTitle().should('have.text', '1 email is invalid:')
    BulkInviteBreakdown.getEmailRow().should('have.text', invalidEmail)

    BulkInviteBreakdown.close()
    BulkInviteBreakdown.verifyIsNotShown()
    cy.visitAdmin('/users')
    UsersPage.userRow(inviteOne.email).exists()
    UsersPage.userRow(inviteTwo.email).exists()
    UsersPage.userRow(inviteThree.email).exists()
    UsersPage.userRow(inviteFour.email).exists()
    UsersPage.userRow(inviteFour.email).accountExpiryMatches(/January 1st 2200/)
    UsersPage.userRow(inviteFive.email).exists()
    UsersPage.role(inviteFive.email).organisationAdmin.verifyIs()
  })
})
