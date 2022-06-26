import { getFetchAdapter } from 'uttp/adapters/fetch'
import { handler } from '../handler.js'

export const fetchHandler = getFetchAdapter(handler)
