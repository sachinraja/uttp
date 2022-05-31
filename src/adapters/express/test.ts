import express from 'express'
import { testFetch } from '../../../test/test-fetch.js'
import { getExpressAdapter } from './index.js'

testFetch('express', async (handler, port) => {
  const app = express()
  const expressAdapter = getExpressAdapter(handler)
  app.use(await expressAdapter())

  const server = app.listen(port)

  return {
    close() {
      server.close()
    },
  }
})
