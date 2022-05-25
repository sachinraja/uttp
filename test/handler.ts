import { defineHandler } from '../src'

export const genericHandler = defineHandler((_, helpers) => {
  return {
    handleRequest(req) {
      helpers.parseBodyAsString(req.rawRequest)
      req
      return {
        status: 200,
        body: 'Hello world!',
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    },
    adapterOptions: {},
  }
})
