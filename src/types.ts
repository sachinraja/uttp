type Dict<T> = Record<string, T | undefined>

type HTTPHeaders = Dict<string | string[]>

export interface RawRequest {
  __brand: 'RawRequest'
}

export interface HTTPRequest {
  rawRequest: RawRequest
  method: string
  searchParams: URLSearchParams
  headers: HTTPHeaders
  body: unknown
}

export type UnhttpResponse = {
  status: number
  headers?: HTTPHeaders
  body: BodyInit | null | undefined
}

export type MaybePromise<T> = T | Promise<T>

export type HandleRequest = (req: HTTPRequest) => MaybePromise<UnhttpResponse>
export interface AdapterOptions {
  maxBodySize?: number
}
export interface HandlerBag {
  handleRequest: HandleRequest
  adapterOptions: AdapterOptions
}

export interface Helpers {
  parseBodyAsString: (rawRequest: RawRequest) => MaybePromise<string | undefined>
}

export type Handler = (
  helpers: Helpers,
  ...args: any[]
) => MaybePromise<HandlerBag>

export const defineHandler = <THandler extends Handler>(handler: THandler): THandler => handler

type DropFirst<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never

export type inferHandlerOptions<THandler extends Handler> = DropFirst<Parameters<THandler>>
