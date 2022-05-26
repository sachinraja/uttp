import express from 'express'
import getPort from 'get-port'
import { getExpressAdapter } from '../src/adapters/express'
import { genericHandler } from './handler'
import { setup } from './test-fetch'

setup('express', async () => {
  const app = express()
  const expressAdapter = getExpressAdapter(genericHandler)
  app.use(await expressAdapter())

  const port = await getPort()
  const server = app.listen(port)

  return {
    close() {
      server.close()
    },
    port,
  }
})
