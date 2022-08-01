import { checkAllEnvironmentVariablesAreSet, linkWorks } from '../../../support/utils'
import * as HomePage from '../../../support/admin/pages/HomePage'
import * as CustomSetup from '../../../support/CustomSetup'

describe('links', () => {
  CustomSetup.withDefaultUser('link to VPAT should open document', () => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/')
    HomePage.clickHelpDropdown()
    linkWorks('HelpDropdownItems.vpatDropdownItem', 'VPAT')
  })

  CustomSetup.withDefaultUser('link to Admin Guide should open webpage', () => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/')
    HomePage.clickHelpDropdown()
    linkWorks('HelpDropdownItems.adminGuideDropdownItem', 'The Glean Admin Guide')
  })
})

describe('environment', () => {
  it('should have all environment variables set', () => {
    cy.visitAdmin('/')
    checkAllEnvironmentVariablesAreSet()
  })
})
