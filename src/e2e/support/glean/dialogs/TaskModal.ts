import { Dayjs } from 'dayjs'
import { blur } from 'support/utils'
import { DueDateSelector } from '../components/DueDateSelector'

export const TASK_BUTTON_SELECTOR = 'task-button'
export const TASK_TEXT_INPUT_SELECTOR = 'TaskCardModal.input'
export const POST_TASK_SELECTOR = 'TaskCardModal.postButton'

export const open = () => cy.getByDataTest(TASK_BUTTON_SELECTOR).click()
export const close = () => cy.getByDataTest('close-modal').click()

export const withBlurredTaskTextInput = () => blur(cy.getByDataTest(TASK_TEXT_INPUT_SELECTOR))

export const post = (taskText: string, dueDate?: Dayjs) => {
  cy.getByDataTest(TASK_TEXT_INPUT_SELECTOR).type(taskText)

  if (dueDate) {
    getDueDateSelector().openDialog()
    getDueDateSelector().verifyDatePickerPopupOpen()
    getDueDateSelector().selectDate(dueDate)
    getDueDateSelector().verifyDatePickerPopupClosed()
  }

  cy.getByDataTest(POST_TASK_SELECTOR).click()
}

const getDueDateSelector = () => new DueDateSelector(cy.getByDataTest('TaskCardModal.modal'))
