import { clickButton, textExists } from './ChargebeeModals'
import { waitForChargebee } from '../chargebeeHelpers'

export const cancel = () => {
  textExists('Manage Subscriptions')
  clickButton('Glean')
  cy.get('#cb-frame').iframe('div').contains('Cancel').click()

  cy.get('#cb-frame').iframe('div').contains('Confirm').click()
  textExists('Your subscription will be cancelled')

  waitForChargebee()
}

export const renew = () => {
  textExists('Manage Subscriptions')

  clickButton('Glean')
  textExists('cancelled')

  clickButton('Resubscribe', true)
  clickButton('Confirm')

  textExists('Cancel Subscription')
}
