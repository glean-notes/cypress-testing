export const isLoaded = () => cy.get('.user-invitation')

export const nameField = () => cy.getByDataTest('user-invitation-name')
export const nameIs = (name: string) => nameField().should('have.value', name)
export const emailIs = (email: string) => cy.getByDataTest('user-invitation-email').should('have.value', email)

const clickSubmit = () => cy.getByDataTest('user-invitation-submit').click()

export const goToNextStep = clickSubmit
export const signUp = clickSubmit

export const getPasswordField = () => cy.getByDataTest('password')

export const enterPassword = (password: string) => getPasswordField().focus().type(password)

export const tickReadTerms = () => cy.getByDataTest('user-invitation-checkbox').click('left')

export const clickNeedHelp = () => cy.getByDataTest('needHelp').click()
