import { Middleware } from 'koa'
import { IncomingMessage } from 'node:http'
import { Handler, HandlerBag, inferHandlerOptions, RawRequest } from '../../types.js'
import { getStringFromIncomingMessage } from '../../util.js'

export const getKoaAdapter = <THandler extends Handler>(
  handler: THandler,
) => {
  return async (...options: inferHandlerOptions<THandler>) => {
    const handlerBag: HandlerBag = await handler({
      parseBodyAsString(rawRequest) {
        const request = rawRequest as unknown as IncomingMessage
        return getStringFromIncomingMessage(request, { maxBodySize: handlerBag.adapterOptions.maxBodySize })
      },
    }, ...options)

    const middleware: Middleware = async (context) => {
      const response = await handlerBag.handleRequest({
        rawRequest: context.req as unknown as RawRequest,
        body: context.body,
        headers: context.headers,
        method: context.method,
        searchParams: context.URL.searchParams,
      })

      context.status = response.status

      if (response.headers) {
        for (const [key, value] of Object.entries(response.headers)) {
          if (typeof value === 'undefined') continue

          context.set(key, value)
        }
      }

      context.body = response.body
    }

    return middleware
  }
}
