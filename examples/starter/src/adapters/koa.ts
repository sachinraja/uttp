import { getKoaAdapter } from 'uttp/adapters/koa'
import { handler } from '../handler.js'

export const koaHandler = getKoaAdapter(handler)
