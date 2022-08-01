import * as SelectEventsPage from 'support/glean/pages/SelectEventsPage'
import * as TaskModal from 'support/glean/dialogs/TaskModal'
import * as EventPage from 'support/glean/pages/EventPage'
import { Dayjs } from 'dayjs'

export interface CreateTaskParams {
  text: string
  completed: boolean
  dateDue?: Dayjs
}

export const createEventWithTasks = (eventName: string, tasks: CreateTaskParams[]) => {
  SelectEventsPage.clickNewEvent()
  EventPage.enterEventName(eventName)

  tasks.forEach(({ text, completed, dateDue }, index) => {
    TaskModal.open()
    TaskModal.post(text, dateDue)
    if (completed) {
      EventPage.getFeedItem(index).clickCompleteTaskCheckbox()
    }
  })

  EventPage.clickBackButton()
}

export const makeCreateTaskParams = ({
  text = 'Some task',
  completed = false,
  dateDue,
}: Partial<CreateTaskParams> = {}): CreateTaskParams => ({ text, completed, dateDue })
