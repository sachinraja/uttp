import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { Handler, HandlerBag, inferHandlerOptions, RawRequest } from '../types'
import { getStringFromIncomingMessage, getUrlWithBase } from '../util'

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
        const req = rawRequest as unknown as FastifyRequest
        if (typeof req.body === 'string') return req.body

        return getStringFromIncomingMessage(req.raw, { maxBodySize: handlerBag.adapterOptions.maxBodySize })
      },
    }, options)

    const plugin: FastifyPluginCallback = async (instance) => {
      instance.removeAllContentTypeParsers()
      instance.addContentTypeParser(
        // allow all content types
        /.*/,
        { bodyLimit: handlerBag.adapterOptions.maxBodySize },
        (_, body, done) => {
          done(null, body)
        },
      )

      const prefix = fastifyAdapterOptions.setPrefix?.(...options) ?? '/'

      instance.all(prefix, async (req, reply) => {
        const url = getUrlWithBase(req.url)

        const res = await handlerBag.handleRequest({
          rawRequest: req as unknown as RawRequest,
          body: req.body,
          headers: req.headers,
          method: req.method!,
          searchParams: url.searchParams,
        })

        reply.status(res.status)

        if (res.headers) {
          reply.headers(res.headers)
        }

        reply.send(res.body)
      })
    }

    return plugin
  }
}
