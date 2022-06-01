import { createServer } from 'node:http'
import { nodeHandler } from '../src/adapters/node.js'
import { User } from '../src/index.js'

const users: Record<User['id'], number> = {}

for (let index = 0; index < 100; index++) {
	users[index] = Math.floor(Math.random() * 100)
}

const server = createServer(
	await nodeHandler({
		handleUser(user) {
			const balance = users[user.id]
			if (!balance) {
				throw new Error('user does not exist')
			}

			return `${user.name} has $${balance}`
		},
	}),
)

const port = 3000
server.listen(port, () => {
	console.log(`listening on http://localhost:${port}`)
})
