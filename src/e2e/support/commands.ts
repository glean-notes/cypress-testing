/* eslint-disable @typescript-eslint/no-namespace,no-restricted-syntax,no-shadow */

import RequestOptions = Cypress.RequestOptions
import Chainable = Cypress.Chainable
import EmailEventType = Cypress.EmailEventType
import RetrieveEmailRequest = Cypress.RetrieveEmailRequest
import VisitOptions = Cypress.VisitOptions
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

  interface FakeChargebeeEvent {
    siteType: string
    id: string
    eventType: string
    occurredAt: Date
    email: string
    customerId: string
    preferredName: string
    subscriptionId: string
    planId: string
    currentTermEnd: Date
    cancelReason?: string
    done: boolean
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

  interface ScreenshotOptions {
    width: number
    height: number
    delay: number
  }

  interface Profile {
    isCancelled: boolean
  }

  type EmailEventType = 'Bounce' | 'Open' | 'Click' | 'Delivery' | 'Complaint' | 'SentToSes'

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
    profile: () => Chainable<Profile>
    createInvite: (request?: CreateInviteRequest) => Chainable<Invite>
    setupUser: (request?: CreateUserRequest) => Chainable<User>
    setupAccountManager: () => Chainable<AccountManagerUser>
    setupChargebeeUser: (request?: CreateChargebeeUserRequest) => Chainable<ChargebeeUser>
    matchScreenshot: (name: string, options?: Partial<ScreenshotOptions>) => void
    matchScreenshotAllModes: (name: string, options?: Partial<ScreenshotOptions>) => void
    verifyEventViewedAuditCreated: (eventId: string) => void
    runChargebeeEventsPoller: () => void
    runReminderService: () => void
    fireFakeChargebeeEvent: (event: FakeChargebeeEvent) => void
    iframe: (selector: string) => Chainable
    paste: (text: string) => void
    runEmailEventsPoller: () => void
    verifyLatestEmailEventType: (emailAddress: string, type: EmailEventType) => void
    runSubscriptionWarningService: () => void
    killHelpscout: () => void
    createOrganisations: (requests?: CreateOrganisationRequest[]) => Chainable<Organisation[]>
    createOrganisation: (request: CreateOrganisationRequest) => Chainable<Organisation>
    createUsers: (requests?: CreateUserRequest[]) => Chainable<User[]>
    runEventExportTask: () => void
    runTranscriptionJobPollerTask: () => void
    retrieveLatestSentEmail: (request: RetrieveEmailRequest) => Chainable<Email>
    runUpdatePersistencePoller: () => void
    dragTo: (target: string, index?: number) => void
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

// chrome blocks the user warning we normally show when we try to leave the page with pending changes
// (https://www.chromestatus.com/feature/5082396709879808)
// overwriting 'visit' and 'reload' to manually write pending changes
Cypress.Commands.overwrite<'visit'>(
  'visit',
  (
    originalVisit: (options: Partial<VisitOptions> & { url: string }) => any,
    options: Partial<VisitOptions> & { url: string }
  ) => runUpdatePersistencePoller().then(() => originalVisit(options))
)

Cypress.Commands.overwrite<'reload'>('reload', (originalReload: (forceReload: boolean) => any, options: boolean) =>
  runUpdatePersistencePoller().then(() => originalReload(options))
)

const runUpdatePersistencePoller = () =>
  cy.window().then(async (theWindow) => {
    const window = theWindow as any
    const poll = window['runUpdatePersistencePoller']
    if (poll) {
      Cypress.log({
        name: 'updatePersistence',
        message: ['Running the update persistence job'],
      })
      await poll()
    }
  })

Cypress.Commands.add('runUpdatePersistencePoller', runUpdatePersistencePoller)

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

Cypress.Commands.add('profile', () => {
  Cypress.log({
    name: 'profile',
    message: ['Get profile'],
  })

  return runRequestWithRetries<Cypress.Profile>({ method: 'GET', url: '/api/profile', ...commonHeaders }).then(
    ({ body }) => body
  )
})

Cypress.Commands.add('matchScreenshot', (name: string, options: Partial<Cypress.ScreenshotOptions> = {}) => {
  matchScreenshotWithRetries(name, options)
})

Cypress.Commands.add('matchScreenshotAllModes', (name: string, options: Partial<Cypress.ScreenshotOptions> = {}) => {
  cy.window().then(async (theWindow: any) => {
    theWindow.enableFeature('darkMode')
    theWindow.setLightMode()
    matchScreenshotWithRetries(name, options).then(() => {
      // have to chain or it skips the light mode screenshot
      theWindow.setDarkMode()
      matchScreenshotWithRetries(`${name}-dark-mode`, options)
    })
  })
})

function matchScreenshotWithRetries(
  name: string,
  options: Partial<Cypress.ScreenshotOptions> = {},
  attempt: number = 1
): Chainable<void> {
  const { width = 1000, height = 800, delay = 1000 } = options

  cy.viewport(width, height)
  cy.wait(delay)

  return cy.window().then(async (theWindow) => {
    ;(theWindow.document?.activeElement as any).blur()

    let screenshotPath: string = ''

    cy.screenshot(name, {
      ...options,
      clip: { x: 0, y: 0, width, height },
      blackout: [...(options.blackout || []), '.nav-bar-logo__link', '.global-header__top-right-box'],
      onAfterScreenshot: (doc: Document, props: any) => {
        screenshotPath = props.path
        if (props.dimensions.width !== width || props.dimensions.height !== height) {
          throw new Error(
            `Cypress decided to not to use the requested height or width, instead screenshot was taken with ${props.dimensions.height} x ${props.dimensions.width}.`
          )
        }
      },
      capture: 'viewport',
    } as any)
      .then(() => cy.task('match-screenshot', { screenshotPath, name }))
      .then((output: any) => {
        try {
          assert.equal(output, true, `screenshots did not match`)
        } catch (err) {
          if (attempt >= 5) {
            throw err
          }

          Cypress.log({
            name: 'Failed screenshot',
            message: `Screenshot ${name} did not match, retrying...`,
          })

          return matchScreenshotWithRetries(name, options, attempt + 1)
        }
      })
  })
}

Cypress.Commands.add('verifyEventViewedAuditCreated', (eventId: string) =>
  runRequestWithRetries<number>({
    method: 'GET',
    url: `/test-helper/get-event-viewed-audit-count/${eventId}`,
    ...commonHeadersWithAuth,
  }).then(({ body: count }) => {
    assert.equal(count, 1, `expected one event viewed audit but got ${count}`)
  })
)

Cypress.Commands.add('runReminderService', () => {
  cy.request({
    method: 'POST',
    url: '/test-helper/run-reminder-service',
    ...commonHeadersWithAuth,
  })
})

Cypress.Commands.add('runChargebeeEventsPoller', () => {
  cy.request({
    method: 'POST',
    url: '/test-helper/poll-recent-chargebee-events',
    ...commonHeadersWithAuth,
  })
})

Cypress.Commands.add('fireFakeChargebeeEvent', (event: Cypress.FakeChargebeeEvent) => {
  cy.request({
    method: 'POST',
    url: '/test-helper/fake-chargebee-event',
    ...commonHeadersWithAuth,
    body: event,
  })
})

Cypress.Commands.add<'iframe', 'element'>(
  'iframe',
  { prevSubject: 'element' },
  ($iframe: JQuery<HTMLElement>, selector) => {
    Cypress.log({
      name: 'iframe',
      consoleProps() {
        return {
          iframe: $iframe,
        }
      },
    })
    return cy.wrap($iframe.contents().find(selector))
  }
)

Cypress.Commands.add<'paste', 'element'>(
  'paste',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, text: string) => {
    ;(subject[0] as HTMLInputElement).value = text
    cy.wrap(subject).type(' ')
  }
)

Cypress.Commands.add('runEmailEventsPoller', () => {
  cy.request({
    method: 'POST',
    url: `/test-helper/run-scheduled-task`,
    body: { taskName: 'RetrieveAwsEmailEvents' },
    ...commonHeadersWithAuth,
  })
})

Cypress.Commands.add('runEventExportTask', () => {
  cy.request({
    method: 'POST',
    url: `/test-helper/run-scheduled-task`,
    body: { taskName: 'EventExporter' },
    ...commonHeadersWithAuth,
  })
})

Cypress.Commands.add('runTranscriptionJobPollerTask', () => {
  cy.request({
    method: 'POST',
    url: `/test-helper/run-scheduled-task`,
    body: { taskName: 'TranscriptionJobPoller' },
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

Cypress.Commands.add('verifyLatestEmailEventType', (emailAddress: string, type: EmailEventType) => {
  let attempts = 0

  function confirmCorrectEmailStatus(): Chainable<any> {
    attempts++
    cy.runEmailEventsPoller()
    return cy
      .request({
        method: 'GET',
        url: `/test-helper/get-latest-email-event-type`,
        body: { emailAddress },
        ...commonHeadersWithAuth,
      })
      .then((response) => {
        try {
          expect(response.body).to.eq(type, `latest email status should be ${type} but was ${response.body}`)
        } catch (err) {
          if (attempts > 5) {
            throw err
          }
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(5000 * attempts)
          return confirmCorrectEmailStatus()
        }

        return response
      })
  }

  return confirmCorrectEmailStatus()
})

Cypress.Commands.add('runSubscriptionWarningService', () => {
  cy.request({
    method: 'POST',
    url: '/test-helper/run-subscription-warning-service',
    ...commonHeadersWithAuth,
  })
})

Cypress.Commands.add('killHelpscout', () => {
  cy.window().then(async (theWindow) => {
    Cypress.log({
      name: 'destroyHelpscout',
      message: ['Destroying helpscout beacon'],
    })

    const windowAsAny = theWindow as any
    await windowAsAny.Beacon('destroy')
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

Cypress.Commands.add<'dragTo', 'element'>(
  'dragTo',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLElement>, targetEl: string, index: number = 0) => {
    cy.wrap(subject).trigger('dragstart')
    cy.get(targetEl).eq(index).trigger('dragenter')
    cy.get(targetEl).eq(index).trigger('dragend')
  }
)

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
