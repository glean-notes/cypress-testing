import { closeModal } from './Modal'

export const clickClose = closeModal

export const verifyIsShown = () => cy.get('.export-information-modal')
