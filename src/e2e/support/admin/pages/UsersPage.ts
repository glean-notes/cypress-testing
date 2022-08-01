import { search } from '../components/SearchBar'

export const verifyIsShown = () => cy.getByDataTest('users-page')

export const inviteUser = () => cy.get('#openInvite').click()

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

export const showAllUsersCheckbox = () => cy.getByDataTest('show-all-orgs')

const ensureShowAllUsersCheckbox = ({ checked }: { checked: boolean }) =>
  showAllUsersCheckbox().then((element) => {
    const currentlyChecked = element.attr('aria-checked') === 'true'
    if (currentlyChecked !== checked) {
      showAllUsersCheckbox().click()
    }
  })

export const ensureShowAllUsersCheckboxIsChecked = () => ensureShowAllUsersCheckbox({ checked: true })

export const ensureShowAllUsersCheckboxIsUnchecked = () => ensureShowAllUsersCheckbox({ checked: false })

export const userRow = (emailAddress: string, searchForUser: boolean = true) => {
  if (searchForUser) {
    search(emailAddress)
  }
  return {
    exists: (assertIsOnlyOneResult: boolean = false) => {
      if (assertIsOnlyOneResult) {
        cy.getByDataTest('user-row').should('have.length', 1)
      }
      return cy.get(`[data-test-email='${emailAddress}']`)
    },
    notExists: () => cy.get(`[data-test-email='${emailAddress}']`).should('not.exist'),
    hasNotes: (notes: string) => cy.get('.user-row__notes').should('have.value', notes),
    accountExpiryMatches: (regex: RegExp) =>
      cy.get('.user-row__account-expiry-date-cell').then((element) => {
        const text = element.text()
        expect(text).to.match(regex)
      }),
    accountExpiryIsEmpty: () => cy.get('.user-row__account-expiry-date-cell').should('have.text', ''),
    statusMatches: (status: string) => cy.getByDataTest('user-row-status').should('have.text', status),
  }
}

const clickActionsDropdown = (emailAddress: string) =>
  userRow(emailAddress).exists(true).getByDataTest('actionsDropdown').click()

const getRole = (emailAddress: string, testId: string, searchForUser: boolean = true) =>
  userRow(emailAddress, searchForUser).exists(true).getByDataTest(testId)

export const trialLabel = (emailAddress: string, searchForUser: boolean = true) =>
  userRow(emailAddress, searchForUser).exists(true).getByDataTest('TRIAL')

export const chargebeeLabel = (emailAddress: string, searchForUser: boolean = true) =>
  userRow(emailAddress, searchForUser).exists(true).getByDataTest('CHARGEBEE')

export const dsaLabel = (emailAddress: string, searchForUser: boolean = true) =>
  userRow(emailAddress, searchForUser).exists(true).getByDataTest('DSA')

export const role = (emailAddress: string, searchForUser: boolean = true) => ({
  superUser: {
    verifyIs: () => getRole(emailAddress, 'SUPER_USER', searchForUser).should('exist'),
    verifyNot: () => getRole(emailAddress, 'SUPER_USER', searchForUser).should('not.exist'),
  },
  organisationAdmin: {
    verifyIs: () => getRole(emailAddress, 'ADMIN', searchForUser).should('exist'),
    verifyNot: () => getRole(emailAddress, 'ADMIN', searchForUser).should('not.exist'),
  },
  accountManager: {
    verifyIs: () => getRole(emailAddress, 'ACCOUNT_MANAGER', searchForUser).should('exist'),
    verifyNot: () => getRole(emailAddress, 'ACCOUNT_MANAGER', searchForUser).should('not.exist'),
  },
})

const selectInActionsMenu = (emailAddress: string, menuItemAttribute: string, searchForUser: boolean = true) => {
  if (searchForUser) {
    search(emailAddress)
  }
  return clickActionsDropdown(emailAddress).findByDataTest(menuItemAttribute).click()
}

export const actions = (emailAddress: string, searchForUser: boolean = true) => ({
  deleteUser: () => selectInActionsMenu(emailAddress, 'deleteUser', searchForUser),
  deleteInvitation: () => selectInActionsMenu(emailAddress, 'deleteUserInvitation', searchForUser),
  withdrawInvitation: () => selectInActionsMenu(emailAddress, 'withdrawUserInvitation', searchForUser),
  resendInvitation: () => selectInActionsMenu(emailAddress, 'resendInvitation', searchForUser),
  editInvite: () => selectInActionsMenu(emailAddress, 'editInvitation', searchForUser),
  editUser: () => selectInActionsMenu(emailAddress, 'editUser', searchForUser),
  expireUser: () => selectInActionsMenu(emailAddress, 'expireUser', searchForUser),
  reactivateUser: () => selectInActionsMenu(emailAddress, 'reactivateUser', searchForUser),
  exportEventsForUser: () => selectInActionsMenu(emailAddress, 'exportEventsForUser', searchForUser),
  viewStatusHistory: () => selectInActionsMenu(emailAddress, 'viewUserAudits', searchForUser),
})

export const verifyUsersDisplayed = (expectedEmails: string[]) =>
  expectedEmails.forEach((email) => {
    cy.get(`[data-test-email="${email}"]`)
  })

export const verifyUserIsInOrganisation = (email: string, organisationName?: string) => {
  userRow(email).exists(true)

  if (organisationName === undefined) {
    cy.get('.user-row__organisation').should('be.empty')
  } else {
    cy.get('.user-row__organisation').contains(organisationName)
  }
}

export const assertUserNote = (username: string, value: string) =>
  cy.contains(`[aria-label="${username} notes"]`, value)
export const setUserNote = (username: string, value: string) =>
  cy.get(`[aria-label="${username} notes"]`).type(`{selectall}{backspace}${value}`)

const existsOrNot = (dataTest: string) => ({
  exists: () => cy.getByDataTest(dataTest),
  notExists: () => cy.getByDataTest(dataTest).should('not.exist'),
})

export const column = () => ({
  organisation: existsOrNot('user-table-header-organisation'),
  name: existsOrNot('user-table-header-name'),
  email: existsOrNot('user-table-header-email'),
  notes: existsOrNot('user-table-header-notes'),
  expires: existsOrNot('user-table-header-expires'),
  countIs: (count: number) => cy.get('th').should('have.length', count),
})

export const chooseUserStatus = () => {
  cy.get('#user-status-filter').click()
  return {
    inviteExpired: () => cy.getByDataTest('user-status-invite-expired').click(),
  }
}

export const visit = () => {
  cy.visitAdmin('/users')
  verifyIsShown()
}
