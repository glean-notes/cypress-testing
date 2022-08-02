/* eslint-disable @typescript-eslint/no-namespace,no-restricted-syntax,no-shadow */

import RequestOptions = Cypress.RequestOptions
import Chainable = Cypress.Chainable
import RetrieveEmailRequest = Cypress.RetrieveEmailRequest
import Organisation = Cypress.Organisation

declare namespace Cypress {
  type GetOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow> | undefined
  type FindOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Shadow> | undefined

  interface User {
    email: string
    password: string
    userId: string
    preferredName: string
    eventId?: string
    organisationId?: string
  }

  interface UserWithOrganisation extends User {
    organisationId: string
  }

  interface ChargebeeUser {
    userId: string
    email: string
    password: string
    chargebeeSubscriptionId: string
    chargebeeCustomerId: string
    planId: string
    siteType: string
  }

  interface AccountManagerUser {
    email: string
    password: string
    userId: string
    preferredName: string
    organisation: Organisation
  }

  interface Invite {
    token: string
    email: string
    preferredName: string
  }

  interface IncludedEvent {
    eventType?: 'AUDIO_ONLY' | 'WITH_NOTES' | 'WITH_SLIDES' | 'WITH_IMAGES' | 'WITH_LARGE_IMAGE'
    schemaVersion?: number
    inCollection?: boolean
  }

  interface CreateUserRequest {
    organisationId?: string
    role?: 'SUPER_USER' | 'ORGANISATION_ADMIN' | 'ACCOUNT_MANAGER'
    unicodeEmailAddress?: boolean
    includedEvent?: IncludedEvent
    subscriptionType?: 'SONOCENT_MANAGED' | 'CHARGEBEE_MANAGED' | 'TRIAL' | 'ORGANISATION_MANAGED'
    accountExpiry?: Date
    email?: string
    bypassIntro?: boolean
    notes?: string
    organisationNotes?: string
    name?: string
    adminAccessType?: 'LIMITED' | 'FULL'
  }

  interface CreateChargebeeUserRequest {
    planId?: string
    isCancelled?: boolean
  }

  interface CreateInviteRequest {
    email?: string
    preferredName?: string
    invitedDaysAgo?: number
    daysUntilExpiry?: number
  }

  type OrganisationLabels = 'DSA' | 'TRIAL'

  interface CreateOrganisationRequest {
    id?: string
    userLimit?: number
    sharingEnabled?: boolean
    sharingPreference?: 'DISALLOWED' | 'ALLOWED_WITHIN_ORGANISATION' | 'ALLOWED_NO_RESTRICTIONS'
    name?: string
    email?: string
    expiryTime?: Date
    adminAccessType?: 'LIMITED' | 'FULL'
    subscriptionType?: 'INSTITUTION' | 'DISTRIBUTOR'
    labels?: OrganisationLabels[]
  }

  interface Organisation {
    id: string
    name: string
    isAtsp: boolean
    userLimit: number
    sharingEnabled: boolean
    sharingPreference: 'DISALLOWED' | 'ALLOWED_WITHIN_ORGANISATION' | 'ALLOWED_NO_RESTRICTIONS'
  }

  interface RetrieveEmailRequest {
    recipient: string
    subject: string
  }

  export interface Email {
    subject: string
    destination: string
    content: string
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable {
    visitAdmin: (path: string) => void
    login: (email: string) => Chainable<Response<any>>
    loginUser: (user: Cypress.User) => Chainable<Response<any>>
    loginAsNewAdmin: () => Chainable<Response<any>>
    loginAsNewSuperuser: () => Chainable<Response<any>>
    logout: () => Chainable<Response<any>>
    createInvite: (request?: CreateInviteRequest) => Chainable<Invite>
    setupUser: (request?: CreateUserRequest) => Chainable<User>
    setupAccountManager: () => Chainable<AccountManagerUser>
    setupChargebeeUser: (request?: CreateChargebeeUserRequest) => Chainable<ChargebeeUser>
    paste: (text: string) => void
    createOrganisations: (requests?: CreateOrganisationRequest[]) => Chainable<Organisation[]>
    createOrganisation: (request: CreateOrganisationRequest) => Chainable<Organisation>
    createUsers: (requests?: CreateUserRequest[]) => Chainable<User[]>
    runEventExportTask: () => void
    retrieveLatestSentEmail: (request: RetrieveEmailRequest) => Chainable<Email>
    getByDataTest: (value: string, options?: GetOptions) => Chainable<JQuery<HTMLElement>>
    findByDataTest: (value: string, options?: FindOptions) => Chainable<JQuery<HTMLElement>>
  }
}

const commonHeaders = { headers: { 'X-Csrf-Prevention': 'true' } }

const commonHeadersWithAuth = {
  ...commonHeaders,
  auth: {
    user: Cypress.env('TEST_HELPER_USR'),
    pass: Cypress.env('TEST_HELPER_PSW'),
  },
}

Cypress.Commands.add('loginAsNewAdmin', () => {
  return cy.setupUser({ role: 'ORGANISATION_ADMIN' }).then((user) => {
    return cy.loginUser(user)
  })
})

Cypress.Commands.add('loginAsNewSuperuser', () => {
  return cy.setupUser({ role: 'SUPER_USER' }).then((user) => {
    return cy.loginUser(user)
  })
})

function runRequestWithRetries<ResponseType = string | undefined>(
  options: Partial<RequestOptions>
): Chainable<Cypress.Response<ResponseType>> {
  let attempts = 0

  function makeRequest(): Chainable<any> {
    attempts++
    return cy.request(options).then((response) => {
      try {
        expect(response.body).not.to.eq(undefined, 'response body must be defined')
        expect(response.body).not.to.eq('', 'response body must not be empty')
      } catch (err) {
        logEmptyResponse(options, response)
        if (attempts > 3) {
          throw err
        }
        return makeRequest()
      }

      return response
    })
  }

  return makeRequest()
}

function logEmptyResponse<ResponseType>(request: Partial<RequestOptions>, response: Cypress.Response<ResponseType>) {
  const message = `Absent response body for ${request.method} ${request.url}: ${response.body}`
  Cypress.log({
    name: 'Empty response',
    message,
  })

  if (Cypress.env('LOG_FAILURES_TO_KIBANA') !== 'false') {
    const cookies = window.document.cookie
    const userId = cookies
      ?.split('; ')
      .find((row) => row.startsWith('userId'))
      ?.split('=')[1]
    const testBrowser = Cypress.browser.displayName

    fetch('/api/logs', {
      method: 'POST',
      headers: { 'X-Csrf-Prevention': 'true', 'content-type': 'application/json;charset=UTF-8' },
      body: JSON.stringify({
        timestamp: Date.now(),
        severity: 'INFO',
        code: 'cypress.droppedResponse',
        message,
        extraFields: {
          request,
          response,
          appName: 'cypress',
          clientType: 'cypress',
          userId,
          testBrowser,
        },
      }),
    })
  }
}

Cypress.Commands.add('login', (email: string) => {
  Cypress.log({
    name: 'login',
    message: ['Starting session via test helper'],
  })

  return runRequestWithRetries({
    method: 'POST',
    url: '/test-helper/begin-session',
    ...commonHeadersWithAuth,
    body: { email },
  })
})

Cypress.Commands.add('loginUser', (user) => cy.login(user.email))

Cypress.Commands.add('logout', () => {
  Cypress.log({
    name: 'logout',
    message: ['Logging out via POST /api/logout'],
  })
  return cy.request({
    method: 'POST',
    url: '/admin/api/logout',
    ...commonHeaders,
  })
})

Cypress.Commands.add('setupUser', (request: Cypress.CreateUserRequest = {}) =>
  runRequestWithRetries<Cypress.User>({
    method: 'POST',
    url: '/test-helper/create-user',
    body: request,
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    Cypress.log({
      name: 'User Creation',
      message: [`created user ${JSON.stringify(body)}`],
    })
    return body
  })
)

Cypress.Commands.add('setupAccountManager', () =>
  runRequestWithRetries<Cypress.AccountManagerUser>({
    method: 'POST',
    url: '/test-helper/create-account-manager',
    body: {},
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    Cypress.log({
      name: 'Account Manager Creation',
      message: [`created user ${JSON.stringify(body)}`],
    })
    return body
  })
)

Cypress.Commands.add('setupChargebeeUser', (request: Cypress.CreateChargebeeUserRequest = {}) =>
  runRequestWithRetries<Cypress.ChargebeeUser>({
    method: 'POST',
    url: '/test-helper/create-chargebee-user',
    body: request,
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    Cypress.log({
      name: 'Chargebee User Creation',
      message: [`created user ${JSON.stringify(body)}`],
    })
    return body
  })
)

Cypress.Commands.add('createInvite', (request: Cypress.CreateInviteRequest = {}) =>
  runRequestWithRetries<Cypress.Invite>({
    method: 'POST',
    url: '/test-helper/create-invite',
    body: request,
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    Cypress.log({
      name: 'User Invited',
      message: [`created invite ${JSON.stringify(body)}`],
    })
    return body
  })
)

Cypress.Commands.add<'paste', 'element'>(
  'paste',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, text: string) => {
    ;(subject[0] as HTMLInputElement).value = text
    cy.wrap(subject).type(' ')
  }
)

Cypress.Commands.add('runEventExportTask', () => {
  cy.request({
    method: 'POST',
    url: `/test-helper/run-scheduled-task`,
    body: { taskName: 'EventExporter' },
    ...commonHeadersWithAuth,
  })
})

Cypress.Commands.add('retrieveLatestSentEmail', (request: RetrieveEmailRequest) => {
  cy.request({
    method: 'POST',
    url: `/test-helper/email`,
    body: request,
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    assert.isNotNull(body, `Email to: [${request.recipient}] subject: [${request.subject}] not found.`)
    return body
  })
})

Cypress.Commands.add('visitAdmin', (path: string) => {
  cy.visit(`${Cypress.env('ADMIN_URL')}${path}`)
})

Cypress.Commands.add('createUsers', (requests: Cypress.CreateUserRequest[] = []) => {
  runRequestWithRetries({
    method: 'POST',
    url: '/test-helper/create-users',
    body: requests,
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    Cypress.log({
      name: 'User Creation',
      message: [`created user(s) ${JSON.stringify(body)}`],
    })
    return body
  })
})

Cypress.Commands.add('createOrganisation', (request: Cypress.CreateOrganisationRequest = {}) => {
  runRequestWithRetries<Organisation[]>({
    method: 'POST',
    url: '/test-helper/create-organisations',
    body: [request],
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    Cypress.log({
      name: 'Organisation Creation',
      message: [`created organisation(s) ${JSON.stringify(body)}`],
    })
    return body[0]
  })
})

Cypress.Commands.add('createOrganisations', (requests: Cypress.CreateOrganisationRequest[] = []) => {
  runRequestWithRetries<Organisation[]>({
    method: 'POST',
    url: '/test-helper/create-organisations',
    body: requests,
    ...commonHeadersWithAuth,
  }).then(({ body }) => {
    Cypress.log({
      name: 'Organisation Creation',
      message: [`created organisation(s) ${JSON.stringify(body)}`],
    })
    return body
  })
})

Cypress.Commands.add<'getByDataTest', 'optional'>(
  'getByDataTest',
  { prevSubject: 'optional' },
  (subject: unknown, value: string, options?: Cypress.GetOptions) => {
    if (subject) {
      return cy.wrap(subject).get(`[data-test="${value}"]`, options)
    } else {
      return cy.get(`[data-test="${value}"]`, options)
    }
  }
)

Cypress.Commands.add<'findByDataTest', 'element'>(
  'findByDataTest',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, value: string, options?: Cypress.FindOptions) =>
    cy.wrap(subject).find(`[data-test="${value}"]`, options)
)
