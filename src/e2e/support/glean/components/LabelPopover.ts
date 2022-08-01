const getPopover = () => {
  return cy.get('.label-popover')
}

export const verifyShowing = () => {
  getPopover()
}

export const verifyNotShowing = () => {
  getPopover().should('not.exist')
}

export const clickHeading = () => {
  getPopover().click(35, 20)
}

export const clickImportant = () => {
  getPopover().click(120, 20)
}
