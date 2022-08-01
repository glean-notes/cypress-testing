import { Dayjs } from 'dayjs'
import { formattedDate } from 'support/common/dateHelpers'

interface DueDateSelectorOptions {
  datePickerInModal: boolean
}

export class DueDateSelector {
  constructor(private item: Chainable<JQuery<HTMLElement>>) {}

  public openDialog = () => {
    this.item.findByDataTest('AlrightDatePickerToggleButton.toggleButton').focus().click()
  }

  public selectDate = (dueDate: Dayjs, options?: DueDateSelectorOptions) => {
    const dueDateFormatted = dueDate.format('MMM D, YYYY')
    this.inAlrightDatePickerModal(options?.datePickerInModal)
      .findByDataTest('AlrightDatePickerForm.formInput')
      .focus()
      .clear()
      .focus()
      .type(`${dueDateFormatted}{enter}`)
  }

  public removeDate = () => {
    this.item.findByDataTest('DueDateSelector.removeButton').click()
  }

  public verifyDatePickerPopupOpen = () => {
    this.item.findByDataTest('AlrightDatePickerPopup.dialog').should('exist')
  }

  public verifyDatePickerPopupClosed = () => {
    this.item.findByDataTest('AlrightDatePickerPopup.dialog').should('not.exist')
  }

  public verifyContainsDueDate = (dueDate: Dayjs) => {
    this.item.findByDataTest('AlrightDatePickerToggleButton.toggleButton').should('contain', formattedDate(dueDate))
  }

  public verifyHasNoDueDate = () => {
    this.item.findByDataTest('AlrightDatePickerToggleButton.toggleButton').should('contain', 'Add Due Date')
  }

  private inAlrightDatePickerModal = (inModal: boolean = false) =>
    inModal ? cy.getByDataTest('AlrightDatePickerModal.modal') : this.item
}
