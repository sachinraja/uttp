import { Handler as ExpressHandler } from 'express'
import { Handler, inferHandlerOptions } from '../../types.js'
import { getNodeAdapter } from '../node/index.js'

export const getExpressAdapter = <THandler extends Handler>(
  handler: THandler,
) => {
  const nodeAdapter = getNodeAdapter(handler)
  return (...options: inferHandlerOptions<THandler>): Promise<ExpressHandler> => nodeAdapter(...options)
}
