import { defineEventHandler } from 'h3'
import { Handler, inferHandlerOptions } from '../../types.js'
import { getNodeAdapter } from '../node/index.js'

export const getH3Adapter = <THandler extends Handler>(
	handler: THandler,
) => {
	const nodeAdapter = getNodeAdapter(handler)
	return async (...options: inferHandlerOptions<THandler>) => {
		const nodeHandler = await nodeAdapter(...options)

		return defineEventHandler(async (event) => {
			await nodeHandler(event.req, event.res)
		})
	}
}
