import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { Handler, HandlerBag, inferHandlerOptions, RawRequest } from '../../types.js'
import { getStringFromIncomingMessage, getUrlWithBase } from '../../util.js'

export interface FastifyAdapterOptions<TOptions extends any[]> {
  setPrefix?(...options: TOptions): string
}

export const getFastifyAdapter = <THandler extends Handler>(
  handler: THandler,
  fastifyAdapterOptions: FastifyAdapterOptions<inferHandlerOptions<THandler>> = {},
) => {
  return async (...options: inferHandlerOptions<THandler>) => {
    const handlerBag: HandlerBag = await handler({
      parseBodyAsString(rawRequest) {
        const request = rawRequest as unknown as FastifyRequest
        if (typeof request.body === 'string') return request.body

        return getStringFromIncomingMessage(request.raw, { maxBodySize: handlerBag.adapterOptions.maxBodySize })
      },
    }, options)

    const plugin: FastifyPluginCallback = async (instance) => {
      instance.removeAllContentTypeParsers()
      instance.addContentTypeParser(
        // allow all content types
        /.*/,
        { bodyLimit: handlerBag.adapterOptions.maxBodySize },
        (_, body, done) => {
          // eslint-disable-next-line unicorn/no-null
          done(null, body)
        },
      )

      const prefix = fastifyAdapterOptions.setPrefix?.(...options) ?? '/'

      instance.all(prefix, async (request, reply) => {
        const url = getUrlWithBase(request.url)

        const response = await handlerBag.handleRequest({
          rawRequest: request as unknown as RawRequest,
          body: request.body,
          headers: request.headers,
          method: request.method!,
          searchParams: url.searchParams,
        })

        reply.status(response.status)

        if (response.headers) {
          reply.headers(response.headers)
        }

        reply.send(response.body)
      })
    }

    return plugin
  }
}
