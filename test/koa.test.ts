import Koa from 'koa'
import { getKoaAdapter } from '../src/adapters/koa'
import { testFetch } from './test-fetch'

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
