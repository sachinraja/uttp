import getPort from 'get-port'
import Koa from 'koa'
import { getKoaAdapter } from '../src/adapters/koa'
import { genericHandler } from './handler'
import { setup } from './test-fetch'

setup('koa', async () => {
  const koaAdapter = getKoaAdapter(genericHandler)
  const app = new Koa()
  app.use(await koaAdapter({}))

  const port = await getPort()
  const server = app.listen(port)

  return {
    close() {
      server.close()
    },
    port,
  }
})
