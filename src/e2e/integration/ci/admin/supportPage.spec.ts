import * as SupportPage from '../../../support/admin/pages/SupportPage'
import { visitSupportPage } from '../../../support/admin/pages/SupportPage'
import * as CustomSetup from '../../../support/CustomSetup'
import * as SelectEventsPage from '../../../support/glean/pages/SelectEventsPage'
import * as EventPage from '../../../support/glean/pages/EventPage'
import * as UsersPage from '../../../support/admin/pages/UsersPage'
import { waitUntilCompleted } from 'support/common/Loader'
import { runUploadAndDeletePoller } from '../../../support/glean/pollers'
import { toast } from '../../../support/common/toast'
import { switchToNewSuperUser, switchUser } from '../../../support/utils'

describe('Support Page', () => {
  it('should display the support page', () => {
    cy.loginAsNewSuperuser()
    visitSupportPage()
  })

  CustomSetup.withDefaultUser('should allow super user to restore a deleted event', (user) => {
    const { email } = user
    SelectEventsPage.logInAndCreateEvent(email)
    EventPage.getEventId()
    cy.get('@eventId').then((eventId) => {
      EventPage.clickBackButton()
      SelectEventsPage.verifyIsLoaded()
      SelectEventsPage.assertNumberOfRows(1)
      runUploadAndDeletePoller()

      SelectEventsPage.clickFirstEventDropdown()
      SelectEventsPage.clickDropdownDelete()
      SelectEventsPage.expectModalOpen()

      SelectEventsPage.clickDropdownDeleteConfirm()
      SelectEventsPage.expectModalClosed()
      SelectEventsPage.assertNumberOfRows(0)
      runUploadAndDeletePoller()

      switchToNewSuperUser(() => {
        SupportPage.visitSupportPage()
        SupportPage.editEventId(`${eventId}`)
        SupportPage.clickRestoreEvent()
        toast.expectInfo(`Event ${eventId} has been restored`)

        switchUser(user)
        SelectEventsPage.visit()
        runUploadAndDeletePoller()
        SelectEventsPage.assertNumberOfRows(1)
      })
    })
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

  CustomSetup.withDefaultUser(
    'should allow super user to copy an event from one user to another',
    ({ email: fromEmail }) => {
      SelectEventsPage.logInAndCreateEvent(fromEmail)
      EventPage.clickBackButton()
      SelectEventsPage.verifyIsLoaded()
      SelectEventsPage.assertNumberOfRows(1)
      runUploadAndDeletePoller()

      switchToNewSuperUser((toUser) => {
        SupportPage.visitSupportPage()
        SupportPage.copyEvents(toUser.email, fromEmail)

        toast.expectInfo(`Successfully copied event from ${fromEmail} to ${toUser.email}`)

        SelectEventsPage.visit()
        runUploadAndDeletePoller()
        SelectEventsPage.assertNumberOfRows(1)
      })
    }
  )
})
