import { Handler, inferHandlerOptions, RawRequest } from '../../types.js'
import { getUrlWithBase } from '../../util.js'

export const getFetchAdapter = <THandler extends Handler>(
	handler: THandler,
) => {
	return async (...options: inferHandlerOptions<THandler>) => {
		const handlerBag = await handler({
			parseBodyAsString(rawRequest) {
				const request = rawRequest as unknown as Request
				return request.text()
			},
		}, ...options)

		return async (request: Request) => {
			const url = getUrlWithBase(request.url!)

			const response = await handlerBag.handleRequest({
				rawRequest: request as unknown as RawRequest,
				body: await request.text(),
				headers: Object.fromEntries(request.headers),
				url,
				searchParams: url.searchParams,
				method: request.method!,
			})

			const fetchResponse = new Response(response.body, {
				status: response.status,
			})

			if (response.headers) {
				for (const [key, value] of Object.entries(response.headers)) {
					if (typeof value === 'undefined') continue

					if (typeof value === 'string') {
						fetchResponse.headers.set(key, value)
						continue
					}

					for (const v of value) fetchResponse.headers.append(key, v)
				}
			}

			return fetchResponse
		}
	}
}
