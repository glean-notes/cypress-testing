export const isDisplayed = () => cy.get('.forgot-password__content')

export const emailField = () => cy.get('[name="email"]')

export const enterEmail = (email: string) => emailField().type(email)

export const submitForm = () => cy.get('.forgot-password-form__submit').click()

export const hasSuccessMessage = () => cy.getByDataTest('forgot-password-email-sent')

export const clickBack = () => cy.get('.forgot_password__back').click()

export const clickGotIt = () => cy.get('.forgot_password__button').click()
