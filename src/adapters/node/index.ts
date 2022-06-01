import { IncomingMessage, ServerResponse } from 'node:http'
import { Handler, HandlerBag, inferHandlerOptions, RawRequest } from '../../types.js'
import { getStringFromIncomingMessage, getUrlWithBase } from '../../util.js'

export const getNodeAdapter = <THandler extends Handler>(
	handler: THandler,
) => {
	return async (...options: inferHandlerOptions<THandler>) => {
		const handlerBag: HandlerBag = await handler({
			parseBodyAsString(rawRequest) {
				const request = rawRequest as unknown as IncomingMessage
				return getStringFromIncomingMessage(request, { maxBodySize: handlerBag.adapterOptions.maxBodySize })
			},
		}, ...options)

		const requestListener = async (request: IncomingMessage, nodeResponse: ServerResponse): Promise<void> => {
			const url = getUrlWithBase(request.url!)

			const response = await handlerBag.handleRequest({
				rawRequest: request as unknown as RawRequest,
				body: undefined,
				headers: request.headers,
				method: request.method!,
				searchParams: url.searchParams,
			})

			nodeResponse.statusCode = response.status

			if (response.headers) {
				for (const [key, value] of Object.entries(response.headers)) {
					if (typeof value === 'undefined') continue

					nodeResponse.setHeader(key, value)
				}
			}

			nodeResponse.end(response.body)
		}

		return requestListener
	}
}
