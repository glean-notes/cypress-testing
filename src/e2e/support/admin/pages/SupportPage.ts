import { selectDropdownItem } from '../components/MultiSelectDropdown'

export const visitSupportPage = () => {
  cy.visitAdmin('/support')
  verifyIsShown()
}

const forceBlur = () => cy.get('.support-actions-page__header').click()

const verifyIsShown = () => cy.getByDataTest('support-actions-page')
export const editEventId = (eventId: string) => cy.getByDataTest('restore-event__event-id').clear().type(eventId)
const getRestoreEventButton = () => cy.getByDataTest('restore-event__submit')
export const clickRestoreEvent = () => getRestoreEventButton().click({ force: true })

const moveChargebeeId = 'move-chargebee-user'
export const selectChargebeeUser = (name: string) => {
  selectDropdownItem(forceBlur, moveChargebeeId, name)
  cy.getByDataTest('move-chargebee-user-submit').click()
}

const copyEventsId = 'copy-event'
export const copyEvents = (toUserEmail: string, fromUserEmail: string) => {
  selectDropdownItem(forceBlur, copyEventsId, fromUserEmail, 0)
  selectDropdownItem(forceBlur, copyEventsId, toUserEmail, 1)
  cy.getByDataTest('copy-event-submit').click()
}
