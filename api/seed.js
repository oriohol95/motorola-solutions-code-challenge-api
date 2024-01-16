import { readFile } from 'node:fs/promises'
import { UserModel } from './models/mongodb/user.js'

const users = JSON.parse(
  await readFile(
    new URL('./data/users.json', import.meta.url)
  )
)

await UserModel.deleteAll()
for (const user of users) {
  await UserModel.create({ input: user })
}

process.exit()
