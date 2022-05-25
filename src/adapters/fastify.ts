import { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { IncomingMessage } from 'http'
import { BodyIsNotStringError } from '../error'
import { AnyObject, GetHandler, Handler, RawRequest } from '../types'
import { getStringFromIncomingMessage, getUrlWithBase } from '../util'

export interface FastifyAdapterOptions<HandlerOptions extends AnyObject> {
  setPrefix?(options: HandlerOptions): string
}

export const getFastifyAdapter = <HandlerOptions extends AnyObject>(
  getHandler: GetHandler<HandlerOptions>,
  adapterOptions: FastifyAdapterOptions<HandlerOptions> = {},
) => {
  return async (handlerOptions: HandlerOptions) => {
    const handler: Handler = await getHandler(handlerOptions, {
      parseBodyAsString(rawRequest) {
        const req = rawRequest as unknown as FastifyRequest
        if (typeof req.body === 'string') return req.body

        return getStringFromIncomingMessage(req.raw, { maxBodySize: handler.adapterOptions.maxBodySize })
      },
    })

    const plugin: FastifyPluginCallback = async (instance) => {
      instance.removeAllContentTypeParsers()
      instance.addContentTypeParser(
        // allow all content types
        /.*/,
        { bodyLimit: handler.adapterOptions.maxBodySize },
        (_, body, done) => {
          done(null, body)
        },
      )

      const prefix = adapterOptions.setPrefix?.(handlerOptions) ?? '/'

      instance.all(prefix, async (req, reply) => {
        const url = getUrlWithBase(req.url)

        const res = await handler.handleRequest({
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
