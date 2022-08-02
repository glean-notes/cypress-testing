import * as SupportPage from '../../../support/admin/pages/SupportPage'
import { visitSupportPage } from '../../../support/admin/pages/SupportPage'
import * as UsersPage from '../../../support/admin/pages/UsersPage'
import { waitUntilCompleted } from 'support/common/Loader'

describe('Support Page', () => {
  it('should display the support page', () => {
    cy.loginAsNewSuperuser()
    visitSupportPage()
  })

  it('should allow super user to move a cancelled chargebee user to sonocent managed', () => {
    cy.setupChargebeeUser({ isCancelled: true }).then(({ email }) => {
      cy.loginAsNewSuperuser()

      UsersPage.visit()
      UsersPage.ensureShowExpiredCheckboxIsChecked()
      UsersPage.chargebeeLabel(email).should('exist')

      SupportPage.visitSupportPage()
      SupportPage.selectChargebeeUser(email)

      waitUntilCompleted()

      UsersPage.visit()
      UsersPage.ensureShowExpiredCheckboxIsChecked()
      UsersPage.chargebeeLabel(email).should('not.exist')
    })
  })
})
