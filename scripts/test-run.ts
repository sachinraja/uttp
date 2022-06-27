import { defineHandler } from '../src'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { runExpress, runFastify, runH3, runKoa, runNode } from '../src/utils/runners.js'

const genericHandler = defineHandler((helpers) => {
	return {
		async handleRequest(request) {
			request.rawRequest
			const body = await helpers.parseBodyAsString(request.rawRequest)
			console.log(body)
			return {
				body: JSON.stringify({ message: 'Hello World' }),
				headers: {
					'Content-Type': 'application/json',
					'Set-Cookie': ['foo=bar', 'foo=bar2'],
				},
				status: 200,
			}
		},
		adapterOptions: {
			maxBodySize: 1024,
		},
	}
})

runNode(genericHandler, [])
