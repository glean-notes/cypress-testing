import { waitForChargebee } from '../chargebeeHelpers'

const page = () => cy.getByDataTest('account-blocked')

export const verifyIsShown = page
export const hasText = (text: string) => page().should('include.text', text)

export const clickUpgrade = () => {
  cy.getByDataTest('upgrade-from-blocked-trial').click()
  waitForChargebee()
}
