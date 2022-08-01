export const passcodeField = () => cy.getByDataTest('passcode')
export const verifyIsShown = passcodeField
export const clickClose = () => {
  cy.getByDataTest('close-button').click()
}
export const getPasscodeValue = (testBlock: (passcode: string) => void) =>
  passcodeField()
    .invoke('text')
    .then((passcode: string) => {
      testBlock(passcode)
    })
