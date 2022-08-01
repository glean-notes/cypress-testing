export const signUp = () => cy.get('.complete-trial-sign-up__submit').click()

export const getPreferredNameField = () => cy.getByDataTest('preferred-name')

export const enterPreferredName = (preferredName: string) => getPreferredNameField().focus().type(preferredName)

export const getPasswordField = () => cy.getByDataTest('password')

export const enterPassword = (password: string) => getPasswordField().focus().type(password)
