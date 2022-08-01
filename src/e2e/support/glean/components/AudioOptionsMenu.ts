export const getPlaybackRateButton = (playbackRate: number) =>
  cy.getByDataTest(`audioOptionsSpeedButton-${playbackRate}`)
export const clickPlaybackRateButton = (playbackRate: number) => getPlaybackRateButton(playbackRate).click()
export const assertPlaybackRateButtonSelected = (playbackRate: number) =>
  getPlaybackRateButton(playbackRate).get('.button--highlight')
export const assertPlaybackRateButtonFocused = (playbackRate: number) =>
  getPlaybackRateButton(playbackRate).should('have.focus')

const getNoiseCancellationAudioOption = () =>
  cy.getByDataTest('audioOptionsItem-enableNoiseCancellation').find('.audio-options__toggle')
export const toggleNoiseCancellationAudioOption = () => getNoiseCancellationAudioOption().click()
export const assertNoiseCancellationAudioOptionFocused = () =>
  cy.getByDataTest('audioOptionsItem-enableNoiseCancellation').find('.audio-options__toggle input').should('have.focus')

const getClickReductionAudioOption = () =>
  cy.getByDataTest('audioOptionsItem-enableNoiseCancellation').find('.audio-options__toggle')
export const toggleClickReductionAudioOption = () => getClickReductionAudioOption().click()
export const assertClickReductionAudioOptionFocused = () =>
  cy.getByDataTest('audioOptionsItem-enableNoiseCancellation').find('.audio-options__toggle input').should('have.focus')

const getHighCutAudioOption = () =>
  cy.getByDataTest('audioOptionsItem-enableNoiseCancellation').find('.audio-options__toggle')
export const toggleHighCutAudioOption = () => getHighCutAudioOption().click()
export const assertHighCutAudioOptionFocused = () =>
  cy.getByDataTest('audioOptionsItem-enableNoiseCancellation').find('.audio-options__toggle input').should('have.focus')

export const verifyAudioOptionsChangedToastIsShown = () => cy.get('#audioEnhancementToast')
export const verifyAudioOptionsChangedToastIsNotShown = () => cy.get('#audioEnhancementToast').should('not.exist')
