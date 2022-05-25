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

type UnhttpResponse = {
  status: number
  headers?: HTTPHeaders
  body: BodyInit | null | undefined
}

export type AnyObject = Record<string, any>
export type EmptyObject = Record<string, never>

export type MaybePromise<T> = T | Promise<T>

export type HandleRequest = (req: HTTPRequest) => MaybePromise<UnhttpResponse>
export interface Handler {
  handleRequest: HandleRequest
  adapterOptions: AdapterOptions
}

export interface Helpers {
  parseBodyAsString: (rawRequest: RawRequest) => MaybePromise<string | undefined>
}

export type GetHandler<Options extends AnyObject = EmptyObject> = (
  options: Options,
  helpers: Helpers,
) => MaybePromise<Handler>

export interface AdapterOptions {
  maxBodySize?: number
}
