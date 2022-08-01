export const verifyIsShown = () => cy.getByDataTest('login-form')

export const getEmailField = () => cy.getByDataTest('login-email')

const getPasswordField = () => cy.getByDataTest('login-password')

export const inputEmail = (email: string) => getEmailField().type(email)

export const inputPassword = (password: string) => getPasswordField().type(password)

export const clickLogIn = () => cy.getByDataTest('login-submit').click()

export const clickForgotPasswordLink = () => cy.getByDataTest('forgot-password').click()

export const errorMessageIs = (errorMessage: string) => cy.getByDataTest('login-error').contains(errorMessage)

export const logIn = (email: string, password: string) => {
  inputEmail(email)
  inputPassword(password)
  clickLogIn()
}
