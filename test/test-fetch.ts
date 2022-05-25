import { beforeAll, describe, expect, test } from 'vitest'
import { MaybePromise } from '../src/types'

interface App {
  close(): void
  port: number
}

let app: App

export const testRes = () => {
  test('basic fetch', async () => {
    const res = await fetch(`http://localhost:${app.port}`)
    const text = await res.text()

    expect(text).toBe('Hello world!')
  })
}

export const setup = (name: string, setupApp: () => MaybePromise<App>) => {
  beforeAll(async () => {
    app = await setupApp()

    return () => app.close()
  })

  describe(name, () => {
    testRes()
  })
}
