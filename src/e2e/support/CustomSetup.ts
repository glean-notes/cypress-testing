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

type EventAndUser = Cypress.User & { eventId: string }

export const withUserAndEvent = (name: string, testBlock: (user: EventAndUser) => void) =>
  it(name, () => {
    cy.setupUser({
      includedEvent: { eventType: 'WITH_NOTES' },
    }).then((userAndEvent) => testBlock(userAndEvent as EventAndUser))
  })

export const withUserAndAudioOnlyEvent = (
  name: string,
  testBlock: (user: EventAndUser) => void,
  config: Cypress.TestConfigOverrides = {}
) =>
  it(name, config, () => {
    cy.setupUser({
      includedEvent: { eventType: 'AUDIO_ONLY' },
    }).then((userAndEvent) => testBlock(userAndEvent as EventAndUser))
  })

export const withUserAndCustomEvent = (
  name: string,
  {
    schemaVersion,
    eventType = 'WITH_NOTES',
  }: {
    schemaVersion?: number
    eventType?: 'WITH_NOTES' | 'AUDIO_ONLY' | 'WITH_SLIDES' | 'WITH_IMAGES' | 'WITH_LARGE_IMAGE'
  } = {},
  testBlock: (user: EventAndUser) => void
) =>
  it(name, () => {
    cy.setupUser({ includedEvent: { eventType, schemaVersion } }).then((userAndEvent) =>
      testBlock(userAndEvent as EventAndUser)
    )
  })

type EventAndCollectionAndUser = EventAndUser & { collectionId: string }

export const withUserAndEventInCollection = (name: string, testBlock: (user: EventAndCollectionAndUser) => void) =>
  it(name, () => {
    cy.setupUser({
      includedEvent: { eventType: 'WITH_NOTES', inCollection: true },
    }).then((userAndEventAndCollection) => testBlock(userAndEventAndCollection as EventAndCollectionAndUser))
  })

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

export const withUnicodeUser = (name: string, testBlock: (user: Cypress.User) => void) =>
  it(name, () => cy.setupUser({ unicodeEmailAddress: true }).then(testBlock))
