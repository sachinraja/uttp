import { createApp } from 'h3'
import { createServer } from 'node:http'
import { testFetch } from '../../../test/test-fetch.js'
import { getH3Adapter } from './index.js'

testFetch('h3', async (handler, port) => {
	const app = createApp()
	const h3Adapter = getH3Adapter(handler)
	app.use('/', await h3Adapter())

	const server = createServer(app).listen(port)

	return {
		close() {
			server.close()
		},
	}
})
