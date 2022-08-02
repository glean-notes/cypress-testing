import { v4 as uuidv4 } from 'uuid'
import 'cypress-wait-until'

export const generateEmailAddress = (domain: string = 'sonocent.com') => `dev-test+${uuidv4()}@${domain}`

export const newEmailAddress = () => `baldrick+${uuidv4()}@glean.co`

export interface WindowFunctionParams {
  functionName: string
  expectedResult?: any
  waitMessage?: string
}

const waitForWindowObject = (windowProp: string) => {
  cy.window().should(async (theWindow) => {
    const window = theWindow as any
    expect(window[windowProp]).not.to.eq(undefined, `waiting for ${windowProp} to be present on window`)
  })
}

export const callWindowFunction = (
  { functionName, expectedResult, waitMessage }: WindowFunctionParams,
  ...args: any[]
) => {
  waitForWindowObject(functionName)

  cy.window().then(async (theWindow) => {
    const window = theWindow as any
    if (expectedResult) {
      expect(await window[functionName](...args)).to.eq(expectedResult, waitMessage)
    } else {
      await window[functionName](...args)
    }
  })
}

export const checkAllEnvironmentVariablesAreSet = () =>
  callWindowFunction({ functionName: 'areAllEnvironmentVariablesSet', expectedResult: true })

export const linkWorks = (testId: string, expectedText: string) => {
  cy.getByDataTest(testId).invoke('removeAttr', 'target').click()
  cy.url().then((url) =>
    cy.request(url).then((response) => {
      expect(response.status).eq(200)
      expect(response.body).contains(expectedText)
    })
  )
}
