/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express'
import fastify from 'fastify'
import { createApp } from 'h3'
import { createServer } from 'http'
import Koa from 'koa'
import { defineHandler } from '../src'
import { getExpressAdapter } from '../src/adapters/express'
import { getFastifyAdapter } from '../src/adapters/fastify'
import { getH3Adapter } from '../src/adapters/h3'
import { getKoaAdapter } from '../src/adapters/koa'
import { getNodeAdapter } from '../src/adapters/node'

const genericHandler = defineHandler((helpers) => {
  return {
    async handleRequest(req) {
      req.rawRequest
      const body = await helpers.parseBodyAsString(req.rawRequest)
      console.log(body)
      return {
        body: JSON.stringify({ message: 'Hello World' }),
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': ['foo=bar', 'foo=bar2'],
        },
        status: 200,
      }
    },
    adapterOptions: {
      maxBodySize: 1024,
    },
  }
})

const runNode = async () => {
  const nodeHandler = getNodeAdapter(genericHandler)

  const server = createServer(await nodeHandler())

  server.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

const runKoa = async () => {
  const koaHandler = getKoaAdapter(genericHandler)

  const app = new Koa()
  app.use(await koaHandler())

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

const runExpress = async () => {
  const expressHandler = getExpressAdapter(genericHandler)

  const app = express()
  app.use(await expressHandler())

  app.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

const runH3 = async () => {
  const h3Handler = getH3Adapter(genericHandler)

  const app = createApp()
  app.use(await h3Handler())

  const server = createServer(app)
  server.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

const runFastify = async () => {
  const getFastifyPlugin = getFastifyAdapter(genericHandler)

  const server = fastify()
  server.register(await getFastifyPlugin())

  server.listen(3000, () => {
    console.log('Listening on port 3000')
  })
}

runH3()
