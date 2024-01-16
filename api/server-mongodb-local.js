import { createApp } from './app.js'
import { UserModel } from './models/mongodb/user.js'

createApp({ userModel: UserModel })
