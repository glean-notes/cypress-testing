import * as LogInForm from 'support/admin/pages/LogInForm'

describe(`Log In Megatest`, () => {
  for (let step = 1; step <= 1; step++) {
    it(`Log In ${step}`, () => {
      cy.visitAdmin('/')
      LogInForm.verifyIsShown()

      LogInForm.inputEmail("some.user@example.com")
      LogInForm.inputPassword('wrongpassword')
      LogInForm.clickLogIn()
  
      LogInForm.errorMessageIs('Your login details are incorrect, please try again.')
    })
  }
})
