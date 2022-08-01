import { callWindowFunction } from '../utils'

export const disableUploadPoller = () => callWindowFunction({ functionName: 'stopUploadAndDeletePoller' })

export const runUploadAndDeletePoller = () => {
  callWindowFunction({ functionName: 'getMiddlewareQueueSize', expectedResult: 0, waitMessage: 'draining middleware' })
  callWindowFunction({ functionName: 'stopUploadAndDeletePoller' })
  callWindowFunction({ functionName: 'runUploadAndDeletePoller' })
}
