import { search } from '../components/SearchBar'

export const verifyIsShown = () => cy.getByDataTest('organisation-page')

interface Labels {
  isAtsp: boolean
  isTrial: boolean
}

const defaultLabels: Labels = { isAtsp: false, isTrial: false }

export const rowContainsOrganisation = (
  name: string,
  accountManager?: string,
  labels: Labels = defaultLabels,
  expiry?: string,
  userLimit?: number,
  type: string = 'Institution',
  userAccessLength?: string
) => {
  search(name)
  cy.contains(name)
  if (accountManager) {
    cy.contains(accountManager)
  }

  checkLabel(labels.isAtsp, 'atsp')
  checkLabel(labels.isTrial, 'trial')

  cy.getByDataTest('organisation-expiry').should('contain', expiry || '')
  if (userLimit === undefined) {
    cy.getByDataTest('user-limit').should('be.empty')
  } else {
    cy.getByDataTest('user-limit').should('contain', userLimit)
  }

  cy.getByDataTest('subscription-type').should('contain', type)

  if (userAccessLength === undefined) {
    cy.getByDataTest('user-access-length').should('be.empty')
  } else {
    cy.getByDataTest('user-access-length').should('contain', userAccessLength)
  }
}

const checkLabel = (property: boolean, propertyName: string) => {
  if (property) {
    cy.getByDataTest(`${propertyName}-organisation`).should('exist')
  } else {
    cy.getByDataTest(`${propertyName}-organisation`).should('not.exist')
  }
}

export const organisationHasNoAccountManager = (name: string) => {
  search(name)
  cy.getByDataTest('account-manager-name').should('be.empty')
}

const getOrganisationRow = (organisationId: string, name: string) => {
  search(name)
  return findOrganisationRow(organisationId)
}

const findOrganisationRow = (organisationId: string) => cy.get(`[data-test-organisation-id="${organisationId}"]`)

export const verifyOrganisationsDisplayed = (names: string[]) => {
  names.forEach((name) => {
    cy.get(`[data-test-name="${name}"]`)
  })
}

export const clickCreateOrganisation = () => cy.getByDataTest('createOrganisation').click()

const clickActionsDropdown = (organisationId: string, organisationName: string) =>
  getOrganisationRow(organisationId, organisationName).findByDataTest('actionsDropdown').click()

const selectInActionsMenu = (organisationId: string, menuItemAttribute: string, organisationName: string) =>
  clickActionsDropdown(organisationId, organisationName).findByDataTest(menuItemAttribute).click()

export const editOrganisation = (organisationId: string, organisationName: string) =>
  selectInActionsMenu(organisationId, 'edit-organisation', organisationName)

export const deleteOrganisation = (organisationId: string, organisationName: string) =>
  selectInActionsMenu(organisationId, 'delete-organisation', organisationName)

export const verifyOrganisationRowIsShown = (organisationId: string) =>
  findOrganisationRow(organisationId).should('exist')

export const verifyOrganisationRowIsNotShown = (organisationId: string) =>
  findOrganisationRow(organisationId).should('not.exist')

export const showExpiredCheckbox = () => cy.getByDataTest('show-expired')

export const ensureShowExpiredCheckboxIsChecked = () => ensureShowExpiredCheckbox({ checked: true })

export const ensureShowExpiredCheckboxIsUnchecked = () => ensureShowExpiredCheckbox({ checked: false })

const ensureShowExpiredCheckbox = ({ checked }: { checked: boolean }) =>
  showExpiredCheckbox().then((element) => {
    const currentlyChecked = element.attr('aria-checked') === 'true'
    if (currentlyChecked !== checked) {
      showExpiredCheckbox().click()
    }
  })
