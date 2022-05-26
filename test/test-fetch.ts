import getPort from 'get-port'
import { beforeAll, describe, expect, test } from 'vitest'
import { Handler, MaybePromise } from '../src/types'
import { genericHandler } from './handler'

let port: number

export const testRes = () => {
  test('basic fetch', async () => {
    const res = await fetch(`http://localhost:${port}`)
    const text = await res.text()

    expect(text).toBe('Hello world!')
  })
}

export const testFetch = (
  name: string,
  setupApp: (handler: Handler, port: number) => MaybePromise<{ close: () => void }>,
) => {
  beforeAll(async () => {
    port = await getPort()
    const { close } = await setupApp(genericHandler, port)

    return () => {
      close()
    }
  })

  describe(name, () => {
    testRes()
  })
}
