import getPort from 'get-port'
import { createApp } from 'h3'
import { createServer } from 'http'
import { getH3Adapter } from '../src/adapters/h3'
import { genericHandler } from './handler'
import { setup } from './test-fetch'

setup('h3', async () => {
  const h3Adapter = getH3Adapter(genericHandler)
  const app = createApp()
  app.use('/', await h3Adapter({}))

  const port = await getPort()
  const server = createServer(app).listen(port)

  return {
    close() {
      server.close()
    },
    port,
  }
})
