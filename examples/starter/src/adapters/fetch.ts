import { getFetchAdapter } from 'unhttp/adapters/fetch'
import { handler } from '../handler.js'

export const fetchHandler = getFetchAdapter(handler)
