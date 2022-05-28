import { IncomingMessage, ServerResponse } from 'http'
import { Handler, HandlerBag, inferHandlerOptions, RawRequest } from '../../types'
import { getStringFromIncomingMessage, getUrlWithBase } from '../../util'

export const getNodeAdapter = <THandler extends Handler>(
  handler: THandler,
) => {
  return async (...options: inferHandlerOptions<THandler>) => {
    const handlerBag: HandlerBag = await handler({
      parseBodyAsString(rawRequest) {
        const req = rawRequest as unknown as IncomingMessage
        return getStringFromIncomingMessage(req, { maxBodySize: handlerBag.adapterOptions.maxBodySize })
      },
    }, ...options)

    const requestListener = async (req: IncomingMessage, nodeRes: ServerResponse): Promise<void> => {
      const url = getUrlWithBase(req.url!)

      const res = await handlerBag.handleRequest({
        rawRequest: req as unknown as RawRequest,
        body: undefined,
        headers: req.headers,
        method: req.method!,
        searchParams: url.searchParams,
      })

      nodeRes.statusCode = res.status

      if (res.headers) {
        for (const [key, value] of Object.entries(res.headers)) {
          if (typeof value === 'undefined') continue

          nodeRes.setHeader(key, value)
        }
      }

      nodeRes.end(res.body)
    }

    return requestListener
  }
}
