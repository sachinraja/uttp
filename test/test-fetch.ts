import getPort from 'get-port'
import { describe, expect, test } from 'vitest'
import { Handler, MaybePromise } from '../src/types'
import { genericHandler, genericHandlerWithBody } from './handlers'

export const testFetch = (
  name: string,
  setupApp: (handler: Handler, port: number) => MaybePromise<{ close: () => void }>,
) => {
  describe(name, () => {
    test('basic fetch', async () => {
      const port = await getPort()
      const { close } = await setupApp(genericHandler, port)

      const res = await fetch(`http://localhost:${port}`)
      const text = await res.text()

      expect(text).toBe('Hello world!')

      close()
    })

    describe('handler with body', () => {
      test('basic', async () => {
        const port = await getPort()
        const { close } = await setupApp(genericHandlerWithBody, port)
        const url = `http://localhost:${port}`

        const body = JSON.stringify([1, 2, 3])
        const res = await fetch(url, {
          headers: {
            // ensure header name is converted to lowercase
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body,
        })
        const text = await res.text()

        expect(text).toBe(body)

        close()
      })

      test('errors with no content-type', async () => {
        const port = await getPort()
        const { close } = await setupApp(genericHandlerWithBody, port)
        const url = `http://localhost:${port}`

        const body = JSON.stringify({ a: 1, b: [2, 3], c: 4 })
        const res = await fetch(url, {
          method: 'POST',
          body,
        })

        expect(res.status).toBe(400)
        expect(await res.text()).toBe('content-type must be json')

        close()
      })

      test('errors with no body', async () => {
        const port = await getPort()
        const { close } = await setupApp(genericHandlerWithBody, port)
        const url = `http://localhost:${port}`

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
        })

        expect(res.status).toBe(400)
        expect(await res.text()).toBe('must have body')

        close()
      })
    })
  })
}
