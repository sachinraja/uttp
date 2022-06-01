import { defineHandler } from '../src'

export const genericHandler = defineHandler(() => {
  return {
    handleRequest() {
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

export const genericHandlerWithBody = defineHandler((helpers) => {
  return {
    async handleRequest(request) {
      if (request.headers['content-type'] !== 'application/json') {
        return {
          status: 400,
          body: 'content-type must be json',
        }
      }

      const body = await helpers.parseBodyAsString(request.rawRequest)

      if (!body) {
        return {
          status: 400,
          body: 'must have body',
        }
      }

      return {
        status: 200,
        body,
        headers: {
          'content-type': 'application/json',
        },
      }
    },
    adapterOptions: {},
  }
})
