import * as UsersPage from 'support/admin/pages/UsersPage'
import * as SearchBar from 'support/admin/components/SearchBar'
import * as OrganisationsPage from 'support/admin/pages/OrganisationsPage'
import * as Pagination from 'support/admin/components/Pagination'
import * as CustomSetup from 'support/CustomSetup'
import { v4 as uuidv4 } from 'uuid'
import { generateEmailAddress } from 'support/utils'

describe('Searching Users', () => {
  const orgId = uuidv4()
  const testUserEmail1 = generateEmailAddress('simonsays.com')
  const testUserEmail2 = generateEmailAddress('simonsays.com')
  CustomSetup.withOrganisationsAndUsers(
    'should allow filtering of users based on a query',
    [{ id: orgId }],
    [
      { organisationId: orgId, role: 'ORGANISATION_ADMIN' },
      { organisationId: orgId, email: testUserEmail1 },
      { organisationId: orgId, email: testUserEmail2 },
    ],
    ([admin]) => {
      cy.loginUser(admin)
      cy.visitAdmin('/users')
      UsersPage.verifyIsShown()
      SearchBar.search('simonsays.com')
      UsersPage.verifyUsersDisplayed([testUserEmail1, testUserEmail2])
    }
  )

  const toggleOrgId = uuidv4()
  CustomSetup.withOrganisationsAndUsers(
    'should allow toggling expired users in and out of view',
    [{ id: toggleOrgId }],
    [{ organisationId: toggleOrgId, role: 'ORGANISATION_ADMIN' }, { organisationId: toggleOrgId }],
    ([{ email: nonExpiredEmail }]) => {
      cy.createInvite({ daysUntilExpiry: 0 }).then(({ email: expiredEmail }) => {
        cy.loginAsNewSuperuser()
        cy.visitAdmin('/users')
        UsersPage.verifyIsShown()
        UsersPage.ensureShowExpiredCheckboxIsChecked()

        UsersPage.userRow(nonExpiredEmail).exists()
        UsersPage.userRow(expiredEmail).exists()

        UsersPage.ensureShowExpiredCheckboxIsUnchecked()

        UsersPage.userRow(nonExpiredEmail).exists()
        UsersPage.userRow(expiredEmail).notExists()
      })
    }
  )

  const orgId5 = uuidv4()
  CustomSetup.withOrganisationsAndUsers(
    'should allow moving through pages',
    [{ id: orgId5 }],
    [{ role: 'ORGANISATION_ADMIN', organisationId: orgId5 }, ...Array(25).fill({ organisationId: orgId5 })],
    ([user]) => {
      cy.loginUser(user)
      cy.visitAdmin('/users')
      UsersPage.verifyIsShown()
      Pagination.verifyIsShown()
      Pagination.clickNextPage()
      Pagination.verifyNextPageIsShown()
    }
  )
})
describe('Organisations', () => {
  CustomSetup.withOrganisationsAndUsers(
    'should allow filtering of organisations based on a query',
    [{}],
    [{ role: 'SUPER_USER' }],
    ([user], [{ name: orgName }]) => {
      cy.loginUser(user)
      cy.visitAdmin('/organisations')
      OrganisationsPage.verifyIsShown()
      SearchBar.search(orgName.slice(-15))
      OrganisationsPage.verifyOrganisationsDisplayed([orgName])
    }
  )

  it('should allow moving through pages', () => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/organisations')
    OrganisationsPage.verifyIsShown()
    Pagination.verifyIsShown()
    Pagination.clickNextPage()
    Pagination.verifyNextPageIsShown()
  })
})
