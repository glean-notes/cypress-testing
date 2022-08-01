export const pressUpArrowKey = () => cy.get('body').trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp', which: 38 })
export const pressDownArrowKey = () =>
  cy.get('body').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown', which: 40 })
export const pressHomeKey = () => cy.get('body').trigger('keydown', { key: 'Home', code: 'Home', which: 36 })
export const pressEndKey = () => cy.get('body').trigger('keydown', { key: 'End', code: 'End', which: 35 })
export const pressEscKey = () => cy.get('body').trigger('keydown', { key: 'Escape', code: 'Escape', which: 27 })

export const pressUpArrowKeyOnFocusedElement = () =>
  cy.focused().trigger('keydown', { key: 'ArrowUp', code: 'ArrowUp', which: 38 })
export const pressDownArrowKeyOnFocusedElement = () =>
  cy.focused().trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown', which: 40 })
export const pressSpaceKeyOnFocusedElement = () =>
  cy.focused().trigger('keydown', { key: ' ', code: 'Space', which: 32 })
export const pressEnterKeyOnFocusedElement = () =>
  cy.focused().trigger('keydown', { key: 'Enter', code: 'Enter', which: 13 })
