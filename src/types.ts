type Dict<T> = Record<string, T | undefined>

type HTTPHeaders = Dict<string | string[]>

/**
 * The raw request from the server framework.
 * This is a branded type to ensure that you only pass the actual request to helper functions.
 */
export interface RawRequest {
	__brand: 'RawRequest'
}

/**
 * A universal request object coerced from each server framework.
 */
export interface HTTPRequest {
	/**
	 * The raw request from the server framework.
	 * This is a branded type to ensure that you only pass the actual request to helper functions.
	 */
	rawRequest: RawRequest
	/**
	 * The body of the request from the server framework.
	 * This is only to give access the the body if necessary, but using the {@link Helpers} to get the body is preferred.
	 */
	body: unknown
	headers: HTTPHeaders
	url: URL
	searchParams: URLSearchParams
	method: string
}

export type UnhttpResponse = {
	status: number
	headers?: HTTPHeaders
	body: BodyInit | null | undefined
}

export type MaybePromise<T> = T | Promise<T>

export type HandleRequest = (request: HTTPRequest) => MaybePromise<UnhttpResponse>
export interface AdapterOptions {
	/**
	 * The maximum size of the body (length of string) that will be read before throwing an error.
	 */
	maxBodySize?: number
}

export interface HandlerBag {
	handleRequest: HandleRequest
	adapterOptions: AdapterOptions
}

/**
 * Universal helper functions that vary in implementation across handlers.
 */
export interface Helpers {
	/**
	 * Reads the body to a string.
	 * Will throw an error if the body is larger than the amount set in {@link AdapterOptions.maxBodySize}.
	 * @param rawRequest Must be the request passed to {@link HandleRequest}.
	 */
	parseBodyAsString: (rawRequest: RawRequest) => MaybePromise<string | undefined>
}

export type Handler = (
	helpers: Helpers,
	...arguments_: any[]
) => MaybePromise<HandlerBag>

export const defineHandler = <THandler extends Handler>(handler: THandler): THandler => handler

export type DropFirst<T extends unknown[]> = T extends [unknown, ...infer U] ? U : never

export type inferHandlerOptions<THandler extends Handler> = DropFirst<Parameters<THandler>>
