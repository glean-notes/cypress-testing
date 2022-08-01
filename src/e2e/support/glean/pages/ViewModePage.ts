import { hideScrollbarsByDataTest } from 'support/utils'

export const verifyIsLoaded = () => backToEditViewButton()

export const eventName = () => cy.get('[data-test="view-mode-title"]')
export const assertEventName = (expectedTitle: string) => eventName().should('contain', expectedTitle)

export const cardText = () => cy.getByDataTest('ViewModeText.text')
export const assertCardText = (expectedText: string) => cardText().should('contain', expectedText)

export const backToEditViewButton = () => cy.getByDataTest('ViewModeBackButton.button')
export const clickBackToEditViewButton = () => backToEditViewButton().click()

export const clickCopy = () => cy.getByDataTest('ViewModeCopyButton.button').click()
export const verifyCopySuccessToastIsShown = () => cy.get('#copyButtonToast')

export const hideScroll = () => hideScrollbarsByDataTest('ViewModePage.mainWrapper')
