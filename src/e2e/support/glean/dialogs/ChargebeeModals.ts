export const clickButton = (buttonText: string, matchCase: boolean = false) => {
  cy.get('#cb-frame').iframe('div').contains(buttonText, { matchCase }).click()
}

export const textExists = (text: string) => {
  cy.get('#cb-frame').iframe('div').contains(text, { matchCase: false })
}
