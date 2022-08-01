const getModalButton = () => cy.get('[role="dialog"]').iframe('.appcues-button-success')
const getModalHeader = () => cy.get('[role="dialog"]').iframe('h2')

export const verifyModal = (headerText: string) => getModalHeader().contains(headerText).should('be.visible')
export const verifyModalGone = (headerText: string) => getModalHeader().contains(headerText).should('not.exist')
export const clickModalButton = (buttonText: string) => getModalButton().contains(buttonText).trigger('click')

const getTooltipButton = () => cy.get('[title="Tooltip"]').iframe('.appcues-button-success')
const getTooltipHeader = () => cy.get('[title="Tooltip"]').iframe('h3')
const getTooltipSpan = () => cy.get('[title="Tooltip"]').iframe('span')

export const verifyTooltip = (headerText: string) => getTooltipHeader().contains(headerText).should('be.visible')
export const verifyTooltipGone = (headerText: string) => getTooltipHeader().contains(headerText).should('not.exist')
export const verifyTooltipNumber = (numberText: string) => getTooltipSpan().contains(numberText).should('be.visible')
export const clickTooltipButton = (buttonText: string) => getTooltipButton().contains(buttonText).trigger('click')

export const verifyNoElementsShowing = () => {
  cy.get('appcues-container').should('not.exist')
  cy.get('appcues-layer').should('not.exist')
}
