export const toast = {
  expectInfo: (message: string) => cy.contains(`.app-toast-message`, message),
  expectError: (message: string) => cy.contains(`.app-toast-message--error`, message),
  close: () => cy.get('.Toastify__close-button').click(),
}
