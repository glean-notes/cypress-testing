export const getPasswordField = () => cy.getByDataTest('password')

export const getSubmitPasswordButton = () => cy.get('.reset-password__submit')

export const enterPassword = (password: string) => getPasswordField().click().focus().type(password)

export const clearPassword = () => getPasswordField().focus().clear()

export const verifyIsLoaded = () => getPasswordField()

export const submitPassword = () => getSubmitPasswordButton().click()

export const verifyPasswordFieldIsFocused = () => cy.focused().should('have.attr', 'name', 'password')

export const hasInvalidOrExpiredTokenError = () => cy.get('[data-test="reset-password-error"]')

export const clickNeedHelp = () => cy.getByDataTest('needHelp').click()
