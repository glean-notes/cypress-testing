import { acceptModal } from './Modal'

export const clickExpire = acceptModal

export const verifyIsShown = () => cy.get('.expire-user-modal')
