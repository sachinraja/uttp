import { Handler } from 'express'
import { AnyObject, GetHandler } from '../types'
import { getNodeAdapter } from './node'

export const getExpressAdapter = <HandlerOptions extends AnyObject>(
  getHandler: GetHandler<HandlerOptions>,
) => {
  const nodeAdapter = getNodeAdapter(getHandler)
  return (options: HandlerOptions): Promise<Handler> => nodeAdapter(options)
}
