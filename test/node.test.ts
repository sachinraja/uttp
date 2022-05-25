import getPort from 'get-port'
import { createServer } from 'http'
import { getNodeAdapter } from '../src/adapters/node'
import { genericHandler } from './handler'
import { setup } from './test-fetch'

setup('node', async () => {
  const nodeAdapter = getNodeAdapter(genericHandler)
  const port = await getPort()
  const server = createServer(await nodeAdapter({})).listen(port)

  return {
    close() {
      server.close()
    },
    port,
  }
})
