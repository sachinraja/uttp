import { defineHandler } from '../src'

export const genericHandler = defineHandler((helpers) => {
  return {
    handleRequest(req) {
      helpers.parseBodyAsString(req.rawRequest)

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
