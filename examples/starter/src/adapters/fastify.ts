import { getFastifyAdapter } from 'unhttp/adapters/fastify'
import { handler } from '../handler.js'

export const getFastifyPlugin = getFastifyAdapter(handler)
