import { fetch } from 'undici'
import { beforeAll, vi } from 'vitest'

beforeAll(() => {
	vi.stubGlobal('fetch', fetch)
})
