import CreateUserRequest = Cypress.CreateUserRequest
import CreateOrganisationRequest = Cypress.CreateOrganisationRequest
import UserWithOrganisation = Cypress.UserWithOrganisation

type TestBlock = (user: Cypress.User) => void
type TestBlockWithOrg = (user: Cypress.UserWithOrganisation, organisation: Cypress.Organisation) => void

export const withUser = (name: string, request: CreateUserRequest, testBlock: TestBlock) =>
  it(name, () => {
    cy.setupUser(request).then((user) => {
      testBlock(user)
    })
  })

export const withUserAtOrganisation = (testName: string, request: CreateUserRequest, testBlock: TestBlockWithOrg) => {
  it(testName, () => {
    cy.createOrganisations([{}]).then((organisations) => {
      cy.setupUser({ ...request, organisationId: organisations[0].id }).then((user) =>
        testBlock(user as UserWithOrganisation, organisations[0])
      )
    })
  })
}

export const withDefaultUser = (name: string, testBlock: TestBlock, config: Cypress.TestConfigOverrides = {}) =>
  it(name, config, () => {
    cy.setupUser().then((user) => {
      testBlock(user)
    })
  })

export const withOrganisationsAndUsers = (
  testName: string,
  organisationRequests: CreateOrganisationRequest[],
  userRequests: CreateUserRequest[],
  testBlock: (users: Cypress.User[], organisations: Cypress.Organisation[]) => void
) => {
  it(testName, () => {
    cy.createOrganisations(organisationRequests).then((organisations) => {
      cy.createUsers(userRequests).then((users) => testBlock(users, organisations))
    })
  })
}

export const withLimitedAccessAdmin = (name: string, testBlock: TestBlock) =>
  it(name, () => {
    cy.createOrganisation({ adminAccessType: 'LIMITED', subscriptionType: 'DISTRIBUTOR' }).then(({ id }) => {
      cy.setupUser({ role: 'ORGANISATION_ADMIN', organisationId: id }).then((user) => {
        testBlock(user)
      })
    })
  })

export const withOrganisationAdmin = (name: string, testBlock: (user: Cypress.UserWithOrganisation) => void) =>
  withUser(name, { role: 'ORGANISATION_ADMIN', bypassIntro: true }, (u) => testBlock(u as Cypress.UserWithOrganisation))

export const withSuperUser = (name: string, testBlock: TestBlock) =>
  withUser(name, { role: 'SUPER_USER', bypassIntro: true }, testBlock)

export const withAccountManger = (name: string, testBlock: (user: Cypress.AccountManagerUser) => void) =>
  it(name, () => {
    cy.setupAccountManager().then((accountManagerUser) => {
      testBlock(accountManagerUser)
    })
  })
