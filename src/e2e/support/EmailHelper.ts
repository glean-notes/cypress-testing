import Chainable = Cypress.Chainable
import { v4 as uuidv4 } from 'uuid'

export const newEmailAddress = () => `dev-test+${uuidv4()}@glean.co`
export const bounceEmailAddress = () => `bounce+${uuidv4()}@simulator.amazonses.com`

export const extractLinkWithRedirect = (linkName: string, body: string): Chainable<string> => {
  const link = extractLink(linkName, body)
  return cy.request(link).its('allRequestResponses').its(1).its('Request URL')
}

export const extractLink = (linkName: string, body: string): string => {
  const htmlObject = document.createElement('div')
  htmlObject.id = 'email-testing'
  htmlObject.innerHTML = body
  document.body.appendChild(htmlObject)
  const links = Array.prototype.slice.call(document.getElementsByTagName('a'))
  const link = links.find((l) => l.outerText === linkName)
  htmlObject.remove()
  return link.href
}
