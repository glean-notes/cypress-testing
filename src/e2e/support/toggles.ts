import { callWindowFunction } from './utils'

export const enableToggle = (name: string): void => callWindowFunction({ functionName: 'enableFeature' }, name)
