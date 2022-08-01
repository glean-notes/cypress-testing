import * as OrganisationsPage from 'support/admin/pages/OrganisationsPage'
import * as CreateOrganisationDialog from 'support/admin/pages/CreateOrganisationPage'
import * as EditOrganisationPage from 'support/admin/pages/EditOrganisationPage'
import * as DeleteOrganisationDialog from 'support/admin/dialogs/DeleteOrganisationDialog'
import { generateEmailAddress } from 'support/utils'
import { toast } from 'support/common/toast'
import * as CustomSetup from 'support/CustomSetup'
import dayjs from 'dayjs'
import { search } from '../../../support/admin/components/SearchBar'

const chargebeeCustomerId = 'v8XLLOtip0i6OiIWe'
const chargebeeSubscriptionId = 'CN1ZHAgKnUkgc75JO'

describe('Organisations', () => {
  CustomSetup.withAccountManger(
    'should allow creating an institution organisation with CB ids',
    (accountManagerUser) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/organisations')
      const emailAddress = generateEmailAddress()
      const name = `new-org-${emailAddress}`

      OrganisationsPage.verifyIsShown()

      OrganisationsPage.clickCreateOrganisation()

      CreateOrganisationDialog.enterName(name)
      CreateOrganisationDialog.enterDisplayName(`${name} display`)
      CreateOrganisationDialog.enterEmail(emailAddress)
      CreateOrganisationDialog.enterChargebeeCustomerId(chargebeeCustomerId)
      CreateOrganisationDialog.tickIsGoogleOrganisation()
      CreateOrganisationDialog.enterUserLimit(100)
      CreateOrganisationDialog.selectAccountManager(accountManagerUser.preferredName)
      CreateOrganisationDialog.enterSubscriptionExpiry('04/21/2200')
      CreateOrganisationDialog.enterChargebeeSubscriptionId(chargebeeSubscriptionId)

      CreateOrganisationDialog.clickCreateOrganisation()

      OrganisationsPage.rowContainsOrganisation(
        name,
        accountManagerUser.preferredName,
        { isAtsp: false, isTrial: false },
        'April 21st 2200',
        100,
        'Institution'
      )
    }
  )

  CustomSetup.withAccountManger(
    'should allow creating an institution organisation without CB ids',
    (accountManagerUser) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/organisations')
      const emailAddress = generateEmailAddress()
      const name = `new-org-${emailAddress}`

      OrganisationsPage.verifyIsShown()

      OrganisationsPage.clickCreateOrganisation()

      CreateOrganisationDialog.untickIsChargbeeSubscription()
      CreateOrganisationDialog.enterName(name)
      CreateOrganisationDialog.enterDisplayName(`${name} display`)
      CreateOrganisationDialog.enterEmail(emailAddress)
      CreateOrganisationDialog.tickIsGoogleOrganisation()
      CreateOrganisationDialog.enterUserLimit(50)
      CreateOrganisationDialog.selectAccountManager(accountManagerUser.preferredName)
      CreateOrganisationDialog.enterSubscriptionExpiry('04/21/2200')

      CreateOrganisationDialog.clickCreateOrganisation()

      OrganisationsPage.rowContainsOrganisation(
        name,
        accountManagerUser.preferredName,
        { isAtsp: false, isTrial: false },
        'April 21st 2200',
        50,
        'Institution'
      )
    }
  )

  CustomSetup.withAccountManger('should allow creating a distributor organisation', (accountManagerUser) => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/organisations')
    const emailAddress = generateEmailAddress()
    const name = `new-org-${emailAddress}`

    OrganisationsPage.verifyIsShown()

    OrganisationsPage.clickCreateOrganisation()

    CreateOrganisationDialog.enterEmail(emailAddress)
    CreateOrganisationDialog.enterName(name)
    CreateOrganisationDialog.enterDisplayName(`${name} display`)
    CreateOrganisationDialog.enterUserLimit(100)
    CreateOrganisationDialog.selectAccountManager(accountManagerUser.preferredName)
    CreateOrganisationDialog.tickIsATSP()
    CreateOrganisationDialog.selectDistributor()

    CreateOrganisationDialog.clickCreateOrganisation()

    OrganisationsPage.rowContainsOrganisation(
      name,
      accountManagerUser.preferredName,
      { isAtsp: true, isTrial: false },
      undefined,
      100,
      'Distributor',
      '5 Years'
    )
  })

  CustomSetup.withAccountManger('should allow creating a trial organisation', (accountManagerUser) => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/organisations')
    const emailAddress = generateEmailAddress()
    const name = `new-org-${emailAddress}`

    OrganisationsPage.verifyIsShown()

    OrganisationsPage.clickCreateOrganisation()

    CreateOrganisationDialog.enterEmail(emailAddress)
    CreateOrganisationDialog.enterName(name)
    CreateOrganisationDialog.enterDisplayName(`${name} display`)
    CreateOrganisationDialog.enterChargebeeCustomerId(chargebeeCustomerId)
    CreateOrganisationDialog.enterUserLimit(100)
    CreateOrganisationDialog.selectAccountManager(accountManagerUser.preferredName)
    CreateOrganisationDialog.tickIsTrial()
    CreateOrganisationDialog.enterChargebeeSubscriptionId(chargebeeSubscriptionId)

    CreateOrganisationDialog.clickCreateOrganisation()

    OrganisationsPage.rowContainsOrganisation(
      name,
      accountManagerUser.preferredName,
      { isTrial: true, isAtsp: false },
      undefined,
      100
    )
  })

  it('should allow creating a limited admin access organisation', () => {
    cy.loginAsNewSuperuser()
    cy.visitAdmin('/organisations')
    const emailAddress = generateEmailAddress()
    const name = `new-org-${emailAddress}`

    OrganisationsPage.verifyIsShown()

    OrganisationsPage.clickCreateOrganisation()

    CreateOrganisationDialog.enterEmail(emailAddress)
    CreateOrganisationDialog.enterName(name)
    CreateOrganisationDialog.enterDisplayName(`${name} display`)
    CreateOrganisationDialog.enterUserLimit(100)
    CreateOrganisationDialog.selectDistributor()
    CreateOrganisationDialog.pickLimitedAccess()
    CreateOrganisationDialog.pickUserAccessLength('2 Years')

    CreateOrganisationDialog.clickCreateOrganisation()

    OrganisationsPage.rowContainsOrganisation(
      name,
      undefined,
      { isAtsp: false, isTrial: false },
      undefined,
      100,
      'Distributor',
      '2 Years'
    )
  })

  CustomSetup.withAccountManger('should allow editing organisations', ({ preferredName: accountMgrName }) => {
    cy.createOrganisations([{}]).then(([organisation]) => {
      const { id: organisationId, name } = organisation
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/organisations')
      OrganisationsPage.verifyIsShown()

      const newName = `new-name-${organisationId}`
      const email = generateEmailAddress()
      const newDisplayName = `${newName} display`

      OrganisationsPage.editOrganisation(organisationId, name)

      EditOrganisationPage.enterEmail(email)
      EditOrganisationPage.enterName(newName)
      EditOrganisationPage.enterDisplayName(newDisplayName)
      EditOrganisationPage.enterUserLimit(100)
      EditOrganisationPage.tickIsGoogleOrganisation()
      EditOrganisationPage.tickEnableSharingControls()
      EditOrganisationPage.editSubscriptionExpiry('04/21/2200')
      EditOrganisationPage.pickLimitedAccess()
      EditOrganisationPage.enterChargebeeSubscriptionId('new-subscription-id')
      EditOrganisationPage.selectAccountManager(accountMgrName)

      EditOrganisationPage.clickSaveChanges()
      toast.expectInfo(`${newName} has been successfully updated`)

      OrganisationsPage.rowContainsOrganisation(
        newName,
        accountMgrName,
        { isAtsp: false, isTrial: false },
        'April 21st 2200',
        100
      )

      cy.visitAdmin(`/edit-organisation/${organisationId}`)
      EditOrganisationPage.verifyIsShown()
      EditOrganisationPage.verifySharingControlsEnabled()
      EditOrganisationPage.removeUserLimit()
      EditOrganisationPage.tickIsTrial()
      EditOrganisationPage.pickFullAccess()
      EditOrganisationPage.removeAccountManager()

      EditOrganisationPage.clickSaveChanges()

      toast.expectInfo(`${newName} has been successfully updated`)
      OrganisationsPage.organisationHasNoAccountManager(newName)
      OrganisationsPage.rowContainsOrganisation(newName, undefined, { isAtsp: false, isTrial: true }, 'April 21st 2200')
    })
  })

  it('should be possible to edit the details of an expired organisation', () => {
    const timeInPast = dayjs().subtract(100, 'day').toDate()
    const organisationRequest = { expiryTime: timeInPast }
    cy.createOrganisations([organisationRequest]).then(([organisation]) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/organisations')
      OrganisationsPage.verifyIsShown()
      OrganisationsPage.ensureShowExpiredCheckboxIsChecked()
      OrganisationsPage.editOrganisation(organisation.id, organisation.name)
      EditOrganisationPage.enterName('Brand new name')
      EditOrganisationPage.clickSaveChanges()
      OrganisationsPage.rowContainsOrganisation('Brand new name')
    })
  })

  it('should be possible to delete an organisation with no users', () => {
    cy.createOrganisation({}).then((organisation) => {
      cy.loginAsNewSuperuser()
      cy.visitAdmin('/organisations')
      OrganisationsPage.verifyIsShown()
      search(organisation.name)
      OrganisationsPage.verifyOrganisationRowIsShown(organisation.id)

      OrganisationsPage.deleteOrganisation(organisation.id, organisation.name)
      DeleteOrganisationDialog.verifyIsShown()
      DeleteOrganisationDialog.clickDelete()

      OrganisationsPage.verifyOrganisationRowIsNotShown(organisation.id)
    })
  })
})
