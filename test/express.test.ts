import express from 'express'
import getPort from 'get-port'
import { Server } from 'http'
import { afterAll, beforeAll } from 'vitest'
import { getExpressAdapter } from '../src/adapters/express'
import { genericHandler } from './handler'
import { AppInfo, testRes } from './test-fetch'

const getApp = async () => {
  const server = express()
  const expressAdapter = getExpressAdapter(genericHandler)
  server.use(await expressAdapter({}))

  return server
}

let server: Server
const appInfo: AppInfo = { name: 'express', port: 0 }

beforeAll(async () => {
  const app = await getApp()
  appInfo.port = await getPort()
  server = app.listen(appInfo.port)
})

afterAll(() => {
  server.close()
})

testRes(appInfo)
