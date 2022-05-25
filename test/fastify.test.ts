import fastify, { FastifyInstance } from 'fastify'
import getPort from 'get-port'
import { afterAll, beforeAll } from 'vitest'
import { getFastifyAdapter } from '../src/adapters/fastify'
import { genericHandler } from './handler'
import { AppInfo, testRes } from './test-fetch'

const getApp = async () => {
  const app = fastify()
  const fastifyAdapter = getFastifyAdapter(genericHandler)
  app.register(await fastifyAdapter({}))

  return app
}

let app: FastifyInstance
const appInfo: AppInfo = { name: 'fastify', port: 0 }

beforeAll(async () => {
  app = await getApp()
  appInfo.port = await getPort()
  app.listen(appInfo.port)
})

afterAll(() => {
  app.close()
})

testRes(appInfo)
