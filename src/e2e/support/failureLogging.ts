import './commands'

const getUserId = (): string | undefined => {
  const cookies = window.document.cookie
  const encodedUserId = cookies
    ?.split('; ')
    .find((row) => row.startsWith('userId'))
    ?.split('=')[1]
  return encodedUserId === undefined ? undefined : decodeURI(encodedUserId)
}

const buildTestFailureLogRecord = (error: Error, runnable: any) => {
  const testName = runnable?.title
  const testContainer = runnable?.parent?.title
  const userId = getUserId()
  const testBrowser = Cypress.browser.displayName

  return {
    timestamp: Date.now(),
    severity: 'INFO',
    code: 'cypress.failure',
    message: `Cypress Failure ${error.message}`,
    stackTrace: error.stack,
    extraFields: {
      testContainer,
      testName,
      appName: 'cypress',
      clientType: 'cypress',
      userId,
      testBrowser,
      buildNumber: Cypress.env('BUILD_NUMBER'),
    },
  }
}

const uploadLogRecord = (logRecord: Record<string, unknown>) =>
  fetch('/api/logs', {
    method: 'POST',
    headers: { 'X-Csrf-Prevention': 'true', 'content-type': 'application/json;charset=UTF-8' },
    body: JSON.stringify(logRecord),
  })

export const setUpFailureLogging = () =>
  Cypress.on('fail', (error, runnable: any) => {
    const logRecord = buildTestFailureLogRecord(error, runnable)
    uploadLogRecord(logRecord)
    throw error
  })
