import { createApp } from 'h3'
import { createServer } from 'http'
import { getH3Adapter } from '../src/adapters/h3'
import { testFetch } from './test-fetch'

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
