import { IncomingMessage, ServerResponse } from 'http'
import { AnyObject, GetHandler, Handler, RawRequest } from '../types'
import { getStringFromIncomingMessage, getUrlWithBase } from '../util'

export const getNodeAdapter = <HandlerOptions extends AnyObject>(
  getHandler: GetHandler<HandlerOptions>,
) => {
  return async (options: HandlerOptions) => {
    const handler: Handler = await getHandler(options, {
      parseBodyAsString(rawRequest) {
        const req = rawRequest as unknown as IncomingMessage
        return getStringFromIncomingMessage(req, { maxBodySize: handler.adapterOptions.maxBodySize })
      },
    })

    const requestListener = async (req: IncomingMessage, nodeRes: ServerResponse): Promise<void> => {
      const url = getUrlWithBase(req.url!)

      const res = await handler.handleRequest({
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
