import fastify from 'fastify'
import { testFetch } from '../../../test/test-fetch.js'
import { getFastifyAdapter } from './index.js'

testFetch('fastify', async (handler, port) => {
	const app = fastify()
	const fastifyAdapter = getFastifyAdapter(handler)
	app.register(await fastifyAdapter())

	await app.listen({ port })

	return {
		close() {
			app.close()
		},
	}
})
