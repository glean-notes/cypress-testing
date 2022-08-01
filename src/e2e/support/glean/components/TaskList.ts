import { formattedDate } from 'support/common/dateHelpers'
import { CreateTaskParams } from '../taskHelper'

const getTask = (index: number) => cy.getByDataTest(`TaskListItem.item`).eq(index)
const getSortingPicker = () => cy.getByDataTest('sorting-picker')
const getViewCompletedButton = () => cy.getByDataTest('TaskListPanel.viewCompletedButton')

export const open = () => cy.getByDataTest('tasksButton').click()

export const close = () => cy.getByDataTest('TaskListPanel.closeButton').click()

export const expectTask = (index: number, task: CreateTaskParams, event: string) =>
  getTask(index).within(() => {
    cy.getByDataTest('TaskListItem.name').should('contain.text', task.text)
    cy.getByDataTest('TaskListItem.event').should('contain.text', event)

    if (task.dateDue !== undefined) {
      cy.getByDataTest('TaskListItem.dateDue').should('contain.text', formattedDate(task.dateDue))
    }
  })

export const expectSorting = (sorting: string) => getSortingPicker().should('contain.text', sorting)

export const sortBy = (sorting: string) => {
  getSortingPicker().click()
  cy.get('.dropdown-item').contains(sorting).click()
}

export const clickTask = (index: number) =>
  getTask(index).within(() => {
    cy.getByDataTest('TaskListItem.name').click()
  })

export const expectNoTasks = () => cy.getByDataTest('TaskListPanel.noTasks')

export const clickCheckbox = (index: number) =>
  getTask(index).within(() => {
    cy.getByDataTest('TaskListItem.checkbox').click()
  })

export const expectSomeCompletedTasks = () => getViewCompletedButton()

export const expectNoOpenTasks = () => cy.getByDataTest('TaskListPanel.noOpenTasks')

export const viewComplete = () => getViewCompletedButton().click()

export const back = () => cy.getByDataTest('TaskListPanel.backButton').click()
