import { getExpressAdapter } from 'uttp/adapters/express'
import { handler } from '../handler.js'

export const expressHandler = getExpressAdapter(handler)
