import { defineEventHandler } from 'h3'
import { AnyObject, GetHandler } from '../types'
import { getNodeAdapter } from './node'

export const getH3Adapter = <HandlerOptions extends AnyObject>(
  getHandler: GetHandler<HandlerOptions>,
) => {
  const nodeAdapter = getNodeAdapter(getHandler)
  return async (options: HandlerOptions) => {
    const nodeHandler = await nodeAdapter(options)

    return defineEventHandler(async (event) => {
      await nodeHandler(event.req, event.res)
    })
  }
}
