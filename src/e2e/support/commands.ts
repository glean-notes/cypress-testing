/* eslint-disable @typescript-eslint/no-namespace,no-restricted-syntax,no-shadow */

declare namespace Cypress {
  type GetOptions = Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow> | undefined

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable {
    visitAdmin: (path: string) => void
    getByDataTest: (value: string, options?: GetOptions) => Chainable<JQuery<HTMLElement>>
  }
}


Cypress.Commands.add('visitAdmin', (path: string) => {
  cy.visit(`${Cypress.env('ADMIN_URL')}${path}`)
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
