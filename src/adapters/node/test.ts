import { createServer } from 'http'
import { testFetch } from '../../../test/test-fetch'
import { getNodeAdapter } from './index'

testFetch('node', async (handler, port) => {
  const nodeAdapter = getNodeAdapter(handler)

  const server = createServer(await nodeAdapter()).listen(port)

  return {
    close() {
      server.close()
    },
  }
})
