import fastify from 'fastify'
import getPort from 'get-port'
import { getFastifyAdapter } from '../src/adapters/fastify'
import { genericHandler } from './handler'
import { setup } from './test-fetch'

setup('fastify', async () => {
  const app = fastify()
  const fastifyAdapter = getFastifyAdapter(genericHandler)
  app.register(await fastifyAdapter({}))

  const port = await getPort()
  await app.listen(port)

  return {
    close() {
      app.close()
    },
    port,
  }
})
