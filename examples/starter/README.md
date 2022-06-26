# uttp-starter

Starter template for uttp.

## Usage

1. Clone the template:

```
npx degit sachinraja/uttp/examples/starter
```

2. Replace all instances of `uttp-starter` with your package name.

3. Start developing! Most of the work should be done in [`src/handler.ts`](src/handler.ts).

## Install

```sh
npm install uttp-starter
```

<details>
<summary>Node</summary><br>

```ts
import { createServer } from 'http'
import { nodeHandler } from 'uttp-starter/adapters/node'

const server = createServer(await nodeHandler(/* options */))
```

Example: [`scripts/node-server.ts`](scripts/node-server.ts)

</details>

<details>
<summary>Express</summary><br>

```ts
import { expressHandler } from 'uttp-starter/adapters/express'

app.use(await expressHandler(/* options */))
```

</details>

<details>
<summary>Fastify</summary><br>

```ts
import { getFastifyPlugin } from 'uttp-starter/adapters/fastify'

server.register(await getFastifyPlugin(/* options */))
```

</details>

<details>
<summary>Fetch</summary><br>

```ts
// Cloudflare Workers example
import { fetchHandler } from 'uttp-starter/adapters/fetch'

export default {
	fetch: await fetchHandler(/* options */),
}
```

</details>

<details>
<summary>h3</summary><br>

```ts
import { h3Handler } from 'uttp-starter/adapters/h3'

app.use(await h3Handler(/* options */))
```

</details>

</details>

<details>
<summary>Nuxt</summary><br>

<!-- dprint-ignore -->
```ts
import { h3Handler } from 'uttp-starter/adapters/h3'

const eventHandler = await h3Handler(/* options */)

export default eventHandler
```

</details>

<details>
<summary>Koa</summary><br>

```ts
import { koaHandler } from 'uttp-starter/adapters/koa'

app.use(await koaHandler(/* options */))
```

</details>

<details>
<summary>AWS Lambda</summary><br>

<!-- dprint-ignore -->
```ts
import { awsLambdaHandler } from 'uttp-starter/adapters/aws-lambda'

// requires es modules/top-level await/Node.js 14 runtime
export const handler = await awsLambdaHandler(/* options */)
```

</details>
