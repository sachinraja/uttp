# uttp

write your request handlers once, run anywhere

currently supports:

- [Node (vanilla HTTP)](https://nodejs.org/api/http.html)
- [Express](https://expressjs.com/)
- [Fastify](https://www.fastify.io/)
- [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) (Cloudflare Workers, Deno, SvelteKit, Astro, Remix, etc.)
- [h3](https://github.com/unjs/h3) (Nuxt)
- [Koa](https://koajs.com/)
- [AWS Lambda](https://aws.amazon.com/lambda/)

## Install

```sh
npm install uttp
```

## Usage

First, define your universal request handler:

```ts
// handler.ts
import { defineHandler } from 'uttp'

export const handler = defineHandler(() => {
	// return an object that will be used by each adapter
	return {
		// called on each request
		handleRequest() {
			// return a response object
			// that will be sent by the server framework
			return {
				status: 200,
				body: 'Hello world!',
				headers: { 'Content-Type': 'text/html' },
			}
		},
		adapterOptions: {},
	}
})
```

For all server frameworks uttp supports this will show `Hello world!` as HTML.

Then you can use adapters to get middleware/plugins/handlers for the server frameworks.

For Node:

```ts
// adapters/node.ts
import { getNodeAdapter } from 'uttp/adapters/node'
import { handler } from '../handler'

export const nodeHandler = getNodeAdapter(handler)
```

Users would use it like this:

```ts
import { nodeHandler } from 'my-lib/adapters/node'

const server = createServer(await nodeHandler())

server.listen(3000)
```

This process is the same for other server frameworks.

For Fastify:

```ts
// adapters/fastify.ts
import { getFastifyAdapter } from 'uttp/adapters/fastify'
import { handler } from '../handler'

export const getFastifyPlugin = getFastifyAdapter(handler)
```

Users would use it like this:

```ts
import { getFastifyPlugin } from 'my-lib/adapters/fastify'

const server = fastify()

server.register(await getFastifyPlugin())

server.listen(3000)
```

Note these placed in a different entry point / file because `uttp/adapters/*` imports directly from the server frameworks. You cannot export multiple handlers from the same entry point because users would be forced to install server frameworks that they are not using.

### Request

A universal request object is passed to `handleRequest` containing some common properties coerced from the individual frameworks:

```ts
import { defineHandler } from 'uttp'

export const handler = defineHandler(() => {
	return {
		handleRequest(req) {
			if (req.method !== 'GET') {
				return { status: 400, body: 'method must be get' }
			}

			return {
				status: 200,
				body: 'Hello world!',
				headers: { 'Content-Type': 'text/html' },
			}
		},
		adapterOptions: {},
	}
})
```

### Helpers

Request handlers are passed a set of universal functions that vary in implementation across frameworks but retain the same signature:

```ts
import { defineHandler } from 'uttp'

export const handler = defineHandler((helpers) => {
  return {
    async handleRequest(req) {
      // each adapter will pass helpers
      // that conform to function signatures
      const body = await helpers.parseBodyAsString(req.rawRequest)

      if (!body) {
        return { status: 400, body: 'must pass body' }
      }

      const json = JSON.parse(body)

      json.

      return {
        status: 200,
        body: 'Hello world!',
        headers: { 'Content-Type': 'text/html' },
      }
    },
    adapterOptions: {},
  }
})
```

If you need a helper that is not currently available, please create an issue.

### User Options

Your request handler can take in options from users of your handler:

```ts
import { defineHandler } from 'uttp'

interface HandlerOptions {
	parse(text: string): any | Promise<any>
	maxBodySize?: number
}

export const handler = defineHandler(
	// specify options type here
	// can specify as many arguments as you want after `helpers`
	// which the user will need to pass
	(helpers, options: HandlerOptions) => {
		return {
			async handleRequest(req) {
				const body = await helpers.parseBodyAsString(req.rawRequest)
				if (!body) return { status: 400, body: 'must have body' }

				const parsedBody = await options.parse(body)

				// ...

				return { status: 200 }
			},
			adapterOptions: {
				maxBodySize: options.maxBodySize,
			},
		}
	},
)
```

Users will pass options like this:

```ts
import { nodeHandler } from 'my-lib/adapters/node'

const server = createServer(await nodeHandler({ parse: JSON.parse }))

server.listen(3000)
```

### Adapter Options

You must return an `adapterOptions` object. These options may be derived from user options. Here is an example with a description of what each option does:

```ts
import { defineHandler } from 'uttp'

export const handler = defineHandler(() => {
	return {
		handleRequest() {
			return { status: 200, body: 'Hello world!' }
		},
		adapterOptions: {
			// limit body size
			maxBodySize: 1000,
		},
	}
})
```

## Starter Templates

See starter templates for how to setup a package that uses uttp.

- [uttp-starter](examples/starter)

## Utilities

uttp comes with some utils to help you build and test your handler.

### Runners

Runners are an easy way to get a server up for a framework by providing your handler. Only some frameworks are supported.

```ts
import {
	runNode,
	// runExpress,
	// runFastify,
	// runH3,
	// runKoa,
} from 'uttp/utils/runners'
// your universal handler
import { handler } from './handler.js'

runNode(
	handler,
	// handler options as an array
	[{ token: 'secret' }],
	// server-related options
	{ port: 3000 },
)
```
