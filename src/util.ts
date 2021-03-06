import { IncomingMessage } from 'node:http'

export const RequestEntityTooLarge = new Error('request entity too large')

interface GetBodyFromIncomingMessageOptions {
	maxBodySize?: number
}

export const getStringFromIncomingMessage = async (
	body: IncomingMessage,
	{ maxBodySize }: GetBodyFromIncomingMessageOptions,
) => {
	return new Promise<string | undefined>((resolve) => {
		let readBody = ''
		let hasBody = false
		body.on('data', function(data) {
			readBody += data
			hasBody = true
			if (typeof maxBodySize === 'number' && readBody.length > maxBodySize) {
				body.socket.destroy()
				throw RequestEntityTooLarge
			}
		})

		body.on('end', () => {
			if (hasBody) {
				return resolve(readBody)
			}

			// eslint-disable-next-line unicorn/no-useless-undefined
			resolve(undefined)
		})
	})
}

export const getUrlWithBase = (url: string) => {
	const stringUrlWithBase = url.startsWith('/') ? `http://127.0.0.1${url}` : url

	return new URL(stringUrlWithBase)
}
