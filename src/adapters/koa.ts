import { IncomingMessage } from 'http'
import { Middleware } from 'koa'
import { AnyObject, GetHandler, Handler, RawRequest } from '../types'
import { getStringFromIncomingMessage } from '../util'

export const getKoaAdapter = <HandlerOptions extends AnyObject>(
  getHandler: GetHandler<HandlerOptions>,
) => {
  return async (options: HandlerOptions) => {
    const handler: Handler = await getHandler(options, {
      parseBodyAsString(rawRequest) {
        const req = rawRequest as unknown as IncomingMessage
        return getStringFromIncomingMessage(req, { maxBodySize: handler.adapterOptions.maxBodySize })
      },
    })

    const middleware: Middleware = async (ctx) => {
      const res = await handler.handleRequest({
        rawRequest: ctx.req as unknown as RawRequest,
        body: ctx.body,
        headers: ctx.headers,
        method: ctx.method,
        searchParams: ctx.URL.searchParams,
      })

      ctx.status = res.status

      if (res.headers) {
        for (const [key, value] of Object.entries(res.headers)) {
          if (typeof value === 'undefined') continue

          ctx.set(key, value)
        }
      }

      ctx.body = res.body
    }

    return middleware
  }
}
