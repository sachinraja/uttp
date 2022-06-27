import { Handler, inferHandlerOptions } from '../types.js'

export type Runner = <THandler extends Handler>(
	handler: THandler,
	handlerOptions: inferHandlerOptions<THandler>,
	serverOptions?: { port?: number },
) => Promise<void>

export const runNode: Runner = async (handler, handlerOptions, serverOptions) => {
	const [
		{ createServer },
		{ getNodeAdapter },
	] = await Promise.all([
		import('node:http'),
		import('../adapters/node/index.js'),
	])

	const nodeHandler = getNodeAdapter(handler)

	const server = createServer(await nodeHandler(...handlerOptions))

	await new Promise<void>((resolve) => server.listen(serverOptions?.port, resolve))
}

export const runExpress: Runner = async (handler, handlerOptions, serverOptions) => {
	const [
		{ default: express },
		{ getExpressAdapter },
	] = await Promise.all([
		import('express'),
		import('../adapters/express/index.js'),
	])

	const expressHandler = getExpressAdapter(handler)

	const app = express()
	app.use(await expressHandler(...handlerOptions))

	await new Promise<void>((resolve) => app.listen(serverOptions?.port, resolve))
}

export const runFastify: Runner = async (handler, handlerOptions, serverOptions) => {
	const [
		{ default: fastify },
		{ getFastifyAdapter },
	] = await Promise.all([
		import('fastify'),
		import('../adapters/fastify/index.js'),
	])

	const getFastifyPlugin = getFastifyAdapter(handler)

	const server = fastify()
	server.register(await getFastifyPlugin(...handlerOptions))

	await server.listen({ port: serverOptions?.port })
}

/**
 * Uses `createServer` from `node:http`.
 */
export const runH3: Runner = async (handler, handlerOptions, serverOptions) => {
	const [
		{ createServer },
		{ createApp },
		{ getH3Adapter },
	] = await Promise.all([
		import('node:http'),
		import('h3'),
		import('../adapters/h3/index.js'),
	])

	const h3Handler = getH3Adapter(handler)

	const app = createApp()
	app.use(await h3Handler(...handlerOptions))

	const server = createServer(app)
	await new Promise<void>((resolve) => server.listen(serverOptions?.port, resolve))
}

export const runKoa: Runner = async (handler, handlerOptions, serverOptions) => {
	const [
		{ default: Koa },
		{ getKoaAdapter },
	] = await Promise.all([
		import('koa'),
		import('../adapters/koa/index.js'),
	])

	const koaHandler = getKoaAdapter(handler)

	const app = new Koa()
	app.use(await koaHandler(...handlerOptions))

	await new Promise<void>((resolve) => app.listen(serverOptions?.port, resolve))
}
