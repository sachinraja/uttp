import { getNodeAdapter } from 'unhttp/adapters/node'
import { handler } from '../handler'

export const nodeHandler = getNodeAdapter(handler)
