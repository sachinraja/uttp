/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
	test: {
		setupFiles: './test/setup.ts',
		include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', '**/test.ts'],
	},
})
