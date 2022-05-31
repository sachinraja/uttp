import { getExpressAdapter } from 'unhttp/adapters/express'
import { handler } from '../handler.js'

export const expressHandler = getExpressAdapter(handler)
