export const chooseOrganisation = (id: string) => {
  cy.getByDataTest('organisation-dropdown').click()
  cy.get(`#${id}`).click()
}
export const removeOrganisation = () => cy.getByDataTest('organisation-dropdown').clear()

export const chooseRole = () => {
  cy.getByDataTest('role-dropdown').click()
  return {
    superUser: () => cy.getByDataTest('edit-role-super-user').click(),
    organisationAdmin: () => cy.getByDataTest('edit-role-organisation-admin').click(),
    accountManager: () => cy.getByDataTest('edit-role-account-manager').click(),
  }
}

export const tickAdminRole = () => cy.getByDataTest('invite-admin').click()

export const removeRole = () => {
  cy.getByDataTest('role-dropdown').click()
  cy.getByDataTest('no-role').click()
}

export const editExpiry = (date: string) => cy.get('#user-expiry-picker').clear().type(date)
export const editEmail = (date: string) => cy.getByDataTest('edit-user-page-email').clear().type(date)

export const submit = () => cy.getByDataTest('accept').click()

export const assertEditUser = () => assertTitle('Edit User')
export const assertEditInvite = () => assertTitle('Edit Invite')
const assertTitle = (title: string) => {
  cy.getByDataTest('edit-user-page-title').should('have.text', title)
  cy.title().should('equal', `${title} - Glean Admin`)
}
