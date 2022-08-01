import { acceptModal } from './Modal'

export const clickDelete = acceptModal

export const verifyIsShown = () => cy.get('.confirm-delete-organisation-dialog')
