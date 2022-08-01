export const isShown = () => cy.get('.intro-page')
export const isVideoShown = () => cy.get('.intro-page__video')

export const getContinue = () => cy.get('.intro-page__continue')
export const clickContinue = () => getContinue().click({ force: true })

export const assertButtonText = (expected: string) => getContinue().contains(expected)

export const iframeIsNotOverlapped = () => cy.get('#introVideo').click()
