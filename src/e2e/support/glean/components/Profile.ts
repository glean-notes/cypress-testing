import { clickProfileMenu } from './GlobalHeader'
import { waitForChargebee } from '../chargebeeHelpers'

const toggleDropdown = () => clickProfileMenu()

export const upgradeTrialButton = () => cy.get('.chargebee-upgrade-trial-button')
export const manageButton = () => cy.get('.chargebee-manage-button')

export const openProfile = () => {
  toggleDropdown()
  cy.getByDataTest('user-menu-item').click()
}

export const closeButton = () => cy.get('.modal-header__close-button')
export const close = () => closeButton().click()

export const openPlan = () => {
  toggleDropdown()
  cy.getByDataTest('plan-menu-item').click()
}

export const upgradeTrial = () => {
  upgradeTrialButton().click()
  waitForChargebee()
}

export const manage = () => {
  manageButton().click()
  waitForChargebee()
}

export const planTab = () => cy.getByDataTest('plan-header')
export const profileTab = () => cy.getByDataTest('profile-header')

export const verifyProfileTabIsLoaded = () => getEmail()
export const verifyPlanTabIsLoaded = () => getPlan()

export const clickPlanTab = () => planTab().click()
export const clickProfileTab = () => profileTab().click()

export const profileContains = (email: string, preferredName: string) => {
  clickProfileTab()
  getEmail().contains(email)
  cy.getByDataTest('preferred-name').should('have.value', preferredName)
}

const preferredNameInput = () => cy.getByDataTest('preferred-name')

export const editPreferredName = (newName: string) => {
  preferredNameInput().focus().clear().type(newName)
}

export const saveChanges = () => {
  cy.getByDataTest('profile-save-changes').click()
}

const getEmail = () => cy.getByDataTest('email')
const getPlan = () => cy.getByDataTest('plan')
const accountExpirationDate = () => cy.getByDataTest('account-expiration')
const getProvider = () => cy.getByDataTest('provider')
const getAdministrator = () => cy.getByDataTest('administrator')

interface PlanOptions {
  expiry?: string
  provider?: string
  administrator?: string
  plan: string
}

export const planIs = (plan: string) => getPlan().contains(plan)

export const planContains = ({ plan, expiry, provider, administrator }: PlanOptions) => {
  clickPlanTab()
  planIs(plan)
  if (expiry) {
    accountExpirationDate().contains(expiry)
  } else {
    accountExpirationDate().should('not.exist')
  }

  if (provider) {
    getProvider().contains(provider)
  } else {
    getProvider().should('not.exist')
  }

  if (administrator) {
    getAdministrator().contains(administrator)
  } else {
    getAdministrator().should('not.exist')
  }
}
