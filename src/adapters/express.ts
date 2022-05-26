import { Handler as ExpressHandler } from 'express'
import { Handler, inferHandlerOptions } from '../types'
import { getNodeAdapter } from './node'

export const getExpressAdapter = <THandler extends Handler>(
  handler: THandler,
) => {
  const nodeAdapter = getNodeAdapter(handler)
  return (...options: inferHandlerOptions<THandler>): Promise<ExpressHandler> => nodeAdapter(...options)
}
