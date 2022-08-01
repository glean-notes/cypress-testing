import 'cypress-file-upload'
import * as Loader from '../../common/Loader'

export const verifyAdminPageIsShown = (expectOrgDropdown: boolean) => {
  cy.getByDataTest('inviteAdminUsers')

  if (expectOrgDropdown) {
    cy.getByDataTest('organisation-dropdown')
  }

  Loader.waitUntilCompleted()
}

export const verifyIsShown = () => {
  cy.getByDataTest('inviteUsers')
  cy.getByDataTest('organisation-dropdown')
  Loader.waitUntilCompleted()
}

export const setEmail = (emailAddress: string) => cy.get('#email').type(emailAddress)
export const setName = (name: string) => cy.get('#name').type(name)
export const invite = () => cy.getByDataTest('accept').click()
export const cancel = () => cy.getByDataTest('cancel').click()
export const chooseRole = () => {
  cy.get('#choose-role').click()
  return {
    superUser: () => cy.getByDataTest('edit-role-super-user').click(),
    organisationAdmin: () => cy.getByDataTest('edit-role-organisation-admin').click(),
    accountManager: () => cy.getByDataTest('edit-role-account-manager').click(),
    atsp: () => cy.getByDataTest('edit-role-atsp').click(),
  }
}
export const tickMakeAdministrator = () => cy.getByDataTest('invite-admin').click()

export const setExpiry = (date: string) => {
  cy.get('#user-expiry-picker').clear().type(date)

  //dismiss the calendar
  cy.getByDataTest('inviteUsers').click()
}

export const selectBulkInviteTab = () => cy.getByDataTest('bulk-invite-tab').click()
export const getFileUploader = () => cy.get('#bulk-invite-user-file-upload')

export const bulkUpload = (invites: any) =>
  getFileUploader().upload({ fileContent: invites, fileName: 'bulk-invite.csv', mimeType: 'text/csv' })

export const limitIs = (limit: string) => cy.getByDataTest('invite-user-limit').contains(limit)
export const limitIsNotShown = () => cy.getByDataTest('invite-user-limit').should('not.exist')

export const userLimitReached = () => cy.getByDataTest('invite-user-limit-reached')

export const chooseOrganisation = (id: string) => {
  cy.getByDataTest('organisation-dropdown').focus()
  cy.get(`#${id}`).click({ force: true })
}

export const inviteUser = (email: string, name: string) => {
  setEmail(email)
  setName(name)
  invite()
}

export const acceptAdminRoleModal = () => {
  cy.getByDataTest('accept-modal').click()
}
