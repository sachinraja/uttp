import { defineHandler, UnhttpResponse } from 'unhttp'
import { User, userSchema } from './index.js'

type MaybePromise<T> = T | Promise<T>

export interface HandlerOptions {
  handleUser(user: User): MaybePromise<UnhttpResponse['body']>
}

export const handler = defineHandler((helpers, options: HandlerOptions) => {
  return {
    async handleRequest(request) {
      const body = await helpers.parseBodyAsString(request.rawRequest)
      if (!body) return { status: 400, body: 'must have body' }

      try {
        const user = userSchema.parse(JSON.parse(body))
        const responseBody = await options.handleUser(user)
        return { status: 200, body: responseBody }
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined

        return { status: 400, body: message }
      }
    },
    adapterOptions: {},
  }
})
