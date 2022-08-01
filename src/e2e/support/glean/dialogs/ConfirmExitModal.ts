export const getExitButton = () => cy.getByDataTest('ConfirmExitModal-exit')
export const verifyIsShown = () => getExitButton
export const getCancelButton = () => cy.getByDataTest('ConfirmExitModal-cancel')
export const clickExitButton = () => getExitButton().click()
export const clickCancelButton = () => getCancelButton().click()
