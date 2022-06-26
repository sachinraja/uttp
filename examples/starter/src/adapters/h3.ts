import { getH3Adapter } from 'uttp/adapters/h3'
import { handler } from '../handler.js'

export const h3Handler = getH3Adapter(handler)
