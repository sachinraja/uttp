import {
	APIGatewayProxyEventV2,
	APIGatewayProxyResultV2,
	APIGatewayProxyStructuredResultV2,
	Handler as APIGatewayHandler,
} from 'aws-lambda'
import { Handler, HandlerBag, inferHandlerOptions, RawRequest } from '../../types.js'
import { getUrlWithBase } from '../../util.js'

/**
 * Only supports [payload format version 2.0](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format).
 * Also requires top-level await.
 */
export const getAwsLambdaAdapter = <THandler extends Handler>(
	handler: THandler,
) => {
	return async (...options: inferHandlerOptions<THandler>) => {
		const handlerBag: HandlerBag = await handler({
			parseBodyAsString(rawRequest) {
				const request = rawRequest as unknown as APIGatewayProxyEventV2
				return request.body
			},
		}, ...options)

		const requestHandler: APIGatewayHandler<APIGatewayProxyEventV2, APIGatewayProxyResultV2> = async (event) => {
			const url = getUrlWithBase(`${event.rawPath}?${event.rawQueryString}`)

			const response = await handlerBag.handleRequest({
				rawRequest: event as unknown as RawRequest,
				body: event.body,
				headers: event.headers,
				method: event.requestContext.http.method,
				url,
			})

			const headers: NonNullable<APIGatewayProxyStructuredResultV2['headers']> = {}

			if (response.headers) {
				for (const [key, value] of Object.entries(response.headers)) {
					if (typeof value === 'undefined') continue

					headers[key] = typeof value === 'string' ? value : value.join(',')
				}
			}

			return {
				statusCode: response.status,
				body: response.body?.toString(),
				headers,
			}
		}

		return requestHandler
	}
}
