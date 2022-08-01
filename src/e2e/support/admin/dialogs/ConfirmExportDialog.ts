import { acceptModal } from './Modal'

export const clickExport = acceptModal

export const verifyIsShown = () => cy.get('.confirm-export-modal')
