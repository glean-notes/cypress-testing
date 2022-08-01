import { toast } from '../../common/toast'
import { selectDropdownItem } from '../components/MultiSelectDropdown'

const getEmail = () => cy.get('#email')
const getName = () => cy.get('#name')
const getDisplayName = () => cy.get('#displayName')
const getIsGoogleOrganisation = () => cy.getByDataTest('organisation-form-isGoogleOrganisation')
const getEnableSharingControls = () => cy.getByDataTest('sharing-controls-enabled')
const getIsTrial = () => cy.getByDataTest('is-trial-organisation')
const getUserLimit = () => cy.getByDataTest('organisation-form-userLimit')
const getSubscriptionExpiry = () => cy.get('#subscriptionExpiry')

export const verifyIsShown = () => cy.get('#edit-organisation-form')

export const enterName = (preferredName: string) => getName().clear().type(preferredName)

export const enterDisplayName = (displayName: string) => getDisplayName().clear().type(displayName)

export const enterEmail = (email: string) => getEmail().clear().type(email)

export const enterUserLimit = (userLimit: number) => getUserLimit().clear().type(userLimit.toString())

export const editSubscriptionExpiry = (date: string) => {
  getSubscriptionExpiry().clear().type(date)
  getEmail().click() // force date picker to close by clicking elsewhere
}

export const enterChargebeeSubscriptionId = (chargebeeSubscriptionId: string) =>
  cy.get('#chargebeeSubscriptionId').type(chargebeeSubscriptionId)

export const removeUserLimit = () => getUserLimit().clear()

export const tickIsGoogleOrganisation = () => getIsGoogleOrganisation().click()
export const tickEnableSharingControls = () => getEnableSharingControls().click()
export const tickIsTrial = () => getIsTrial().click()

export const verifySharingControlsEnabled = () =>
  getEnableSharingControls().should('have.class', 'glean-checkbox--checked')

export const selectAccountManager = (name: string) => selectDropdownItem(blur, undefined, name)

export const removeAccountManager = () => cy.get('.clear-selected-button').click()

export const clickSaveChanges = () => {
  cy.getByDataTest('accept').click()
  toast.expectInfo(`has been successfully updated`)
}

export const assertNameDoesNotExist = () => getName().should('not.exist')
export const assertDisplayNameIs = (displayName: string) => getDisplayName().should('have.value', displayName)
export const assertEmailIs = (email: string) => getEmail().should('have.value', email)
export const assertIsGoogleOrganisationIsTrue = () =>
  getIsGoogleOrganisation().should('have.class', 'glean-checkbox--checked')

export const assertSendingAllowedCheckbox = (checked: 'true' | 'false') => {
  sendingAllowedCheckbox().then((u) => {
    expect(u.attr('aria-checked')).to.equal(checked)
  })
}

export const assertSendingWithinOrgRadio = (selected: 'true' | 'false') => {
  sendingAllowedWithinOrgRadio().then((u) => {
    expect(u.attr('aria-checked')).to.equal(selected)
  })
}

export const assertSendingAnywhereRadio = (selected: 'true' | 'false') => {
  sendingAllowedAnywhereRadio().then((u) => {
    expect(u.attr('aria-checked')).to.equal(selected)
  })
}

export const assertSendingRadiosHidden = () => {
  sendingAllowedWithinOrgRadio().should('not.exist')
  sendingAllowedAnywhereRadio().should('not.exist')
}

const pickAccess = (access: string) => {
  cy.getByDataTest('admin-access-type-dropdown').click()
  cy.contains(access).click()
}

export const pickLimitedAccess = () => pickAccess('Limited Access')
export const pickFullAccess = () => pickAccess('Full Access')

export const sendingAllowedCheckbox = () => cy.getByDataTest('sending-allowed')
export const sendingAllowedWithinOrgRadio = () => cy.getByDataTest('sending-allowed-within-organisation')
export const sendingAllowedAnywhereRadio = () => cy.getByDataTest('sending-allowed-no-restrictions')
