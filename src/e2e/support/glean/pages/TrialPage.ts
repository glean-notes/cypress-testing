import { hideScrollbars } from 'support/utils'

export const isLoaded = () => cy.get('.trial-form')

export const signUp = () => cy.getByDataTest('submit').click()

export const getEmailField = () => cy.getByDataTest('email')

export const chooseForMyself = () => cy.getByDataTest('trial-reason-SELF').click()

export const chooseForInstitution = () => cy.getByDataTest('trial-reason-OTHERS').click()

export const enterEmail = (email: string) => getEmailField().focus().type(email)

export const emailWasSent = () => cy.getByDataTest('trial-page-success')

export const hideScroll = () => hideScrollbars('body')
