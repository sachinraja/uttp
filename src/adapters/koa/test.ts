import Koa from 'koa'
import { testFetch } from '../../../test/test-fetch.js'
import { getKoaAdapter } from './index.js'

testFetch('koa', async (handler, port) => {
	const app = new Koa()
	const koaAdapter = getKoaAdapter(handler)
	app.use(await koaAdapter())

	const server = app.listen(port)

	return {
		close() {
			server.close()
		},
	}
})
