import * as Loader from '../../common/Loader'
import { selectDropdownItem } from '../components/MultiSelectDropdown'

const blur = () => cy.get('#name').click()

export const verifyIsShown = () => {
  cy.getByDataTest('create-organisation-page')
  cy.getByDataTest('AccountManagerDropdown.loading').should('not.exist')
  Loader.waitUntilCompleted()
}

export const enterName = (name: string) => cy.get('#name').type(name)
export const enterDisplayName = (name: string) => cy.get('#displayName').type(name)

export const enterEmail = (email: string) => cy.get('#email').type(email)
export const enterChargebeeCustomerId = (chargebeeCustomerId: string) =>
  cy.get('#chargebeeCustomerId').type(chargebeeCustomerId)

export const enterChargebeeSubscriptionId = (chargebeeSubscriptionId: string) =>
  cy.get('#chargebeeSubscriptionId').type(chargebeeSubscriptionId)

export const enterUserLimit = (userLimit: number) =>
  cy.getByDataTest('organisation-form-userLimit').type(userLimit.toString())

export const enterSubscriptionExpiry = (date: string) => {
  cy.get('#subscriptionExpiry').clear().type(date)
  blur()
}

export const pickLimitedAccess = () => {
  cy.getByDataTest('admin-access-type-dropdown').click()
  cy.contains('Limited Access').click()
}

export const pickUserAccessLength = (length: string) => {
  cy.getByDataTest('user-access-length-dropdown').click()
  cy.contains(length).click()
}

export const tickIsGoogleOrganisation = () => cy.getByDataTest('organisation-form-isGoogleOrganisation').click()
export const tickIsATSP = () => cy.getByDataTest('is-atsp-organisation').click()
export const tickIsTrial = () => cy.getByDataTest('is-trial-organisation').click()
export const untickIsChargbeeSubscription = () => cy.getByDataTest('is-chargebee-subscription').click()

export const selectDistributor = () => cy.getByDataTest('Distributor').click()
export const selectAccountManager = (name: string) => selectDropdownItem(blur, undefined, name)

export const clickCreateOrganisation = () => cy.getByDataTest('accept').click()
