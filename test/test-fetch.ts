import { describe, expect, test } from 'vitest'

export interface AppInfo {
  name: string
  port: number
}

export const testRes = (appInfo: AppInfo) => {
  describe(appInfo.name, () => {
    test('basic fetch', async () => {
      const res = await fetch(`http://localhost:${appInfo.port}`)
      const text = await res.text()
      if (appInfo.name === 'fastify') {
        console.log(text)
      }
      expect(text).toBe('Hello world!')
    })
  })
}
