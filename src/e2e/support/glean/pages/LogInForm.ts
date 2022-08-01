export const verifyIsShown = () => cy.contains('Log In')

export const getField = (name: string) => cy.get(`[name="${name}"]`)

export const emailField = () => getField('email')

export const setUsername = (username: string) => emailField().type(username)
export const setPassword = (password: string) =>
  getField('password').type(`{selectall}{del}${password}`, { log: false })

export const login = (username?: string, password?: string) => {
  if (username) {
    setUsername(username)
  }

  if (password) {
    setPassword(password)
  }

  cy.get('input[type="submit"]').click()
}

export const clickForgotPasswordLink = () => cy.get('.logged-out-app-links__forgot-password').click()

export const clickNeedHelp = () => cy.getByDataTest('needHelp').click()
