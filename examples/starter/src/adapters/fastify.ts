import { getFastifyAdapter } from 'uttp/adapters/fastify'
import { handler } from '../handler.js'

export const getFastifyPlugin = getFastifyAdapter(handler)
