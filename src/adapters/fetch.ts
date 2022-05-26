import { Handler, inferHandlerOptions, RawRequest } from '../types'
import { getUrlWithBase } from '../util'

export const getFastifyAdapter = <THandler extends Handler>(
  handler: THandler,
) => {
  return async (...options: inferHandlerOptions<THandler>) => {
    const handlerBag = await handler({
      parseBodyAsString(rawRequest) {
        const req = rawRequest as unknown as Request
        return req.text()
      },
    }, ...options)

    return async (req: Request) => {
      const url = getUrlWithBase(req.url!)

      const res = await handlerBag.handleRequest({
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
