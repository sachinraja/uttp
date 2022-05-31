import { getKoaAdapter } from 'unhttp/adapters/koa'
import { handler } from '../handler.js'

export const koaHandler = getKoaAdapter(handler)
