import { createServer } from 'node:http'
import { testFetch } from '../../../test/test-fetch.js'
import { getNodeAdapter } from './index.js'

testFetch('node', async (handler, port) => {
	const nodeAdapter = getNodeAdapter(handler)

	const server = createServer(await nodeAdapter()).listen(port)

	return {
		close() {
			server.close()
		},
	}
})
