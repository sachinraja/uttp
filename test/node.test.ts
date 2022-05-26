import { createServer } from 'http'
import { getNodeAdapter } from '../src/adapters/node'
import { testFetch } from './test-fetch'

testFetch('node', async (handler, port) => {
  const nodeAdapter = getNodeAdapter(handler)

  const server = createServer(await nodeAdapter()).listen(port)

  return {
    close() {
      server.close()
    },
  }
})
