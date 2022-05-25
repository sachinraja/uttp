import { AnyObject, GetHandler, RawRequest } from '../types'
import { getUrlWithBase } from '../util'

export const getFastifyAdapter = <HandlerOptions extends AnyObject>(
  getHandler: GetHandler<HandlerOptions>,
) => {
  return async (options: HandlerOptions) => {
    const handler = await getHandler(options, {
      parseBodyAsString(rawRequest) {
        const req = rawRequest as unknown as Request
        return req.text()
      },
    })

    return async (req: Request) => {
      const url = getUrlWithBase(req.url!)

      const res = await handler.handleRequest({
        rawRequest: req as unknown as RawRequest,
        body: await req.text(),
        headers: Object.fromEntries(req.headers),
        method: req.method!,
        searchParams: url.searchParams,
      })

      const fetchRes = new Response(res.body, {
        status: res.status,
      })

      if (res.headers) {
        for (const [key, value] of Object.entries(res.headers)) {
          if (typeof value === 'undefined') continue

          if (typeof value === 'string') {
            fetchRes.headers.set(key, value)
            continue
          }

          for (const v of value) fetchRes.headers.append(key, v)
        }
      }

      return fetchRes
    }
  }
}
