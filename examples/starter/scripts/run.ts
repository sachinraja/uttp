// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { runExpress, runFastify, runH3, runKoa, runNode } from 'uttp/utils/runners'
import { handler } from '../src/handler.js'
import { User } from '../src/index.js'

const users: Record<User['id'], number> = {}

for (let index = 0; index < 100; index++) {
	users[index] = Math.floor(Math.random() * 100)
}

const port = 3000

await runNode(handler, [{
	handleUser(user) {
		const balance = users[user.id]
		if (!balance) {
			throw new Error('user does not exist')
		}

		return `${user.name} has $${balance}`
	},
}], {
	port,
})

console.log(`listening at http://localhost:${port}`)
