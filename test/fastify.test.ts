import fastify from 'fastify'
import { getFastifyAdapter } from '../src/adapters/fastify'
import { testFetch } from './test-fetch'

testFetch('fastify', async (handler, port) => {
  const app = fastify()
  const fastifyAdapter = getFastifyAdapter(handler)
  app.register(await fastifyAdapter())

  await app.listen(port)

  return {
    close() {
      app.close()
    },
  }
})
