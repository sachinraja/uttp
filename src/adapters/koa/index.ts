import { IncomingMessage } from 'http'
import { Middleware } from 'koa'
import { Handler, HandlerBag, inferHandlerOptions, RawRequest } from '../../types'
import { getStringFromIncomingMessage } from '../../util'

export const getKoaAdapter = <THandler extends Handler>(
  handler: THandler,
) => {
  return async (...options: inferHandlerOptions<THandler>) => {
    const handlerBag: HandlerBag = await handler({
      parseBodyAsString(rawRequest) {
        const req = rawRequest as unknown as IncomingMessage
        return getStringFromIncomingMessage(req, { maxBodySize: handlerBag.adapterOptions.maxBodySize })
      },
    }, ...options)

    const middleware: Middleware = async (ctx) => {
      const res = await handlerBag.handleRequest({
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
