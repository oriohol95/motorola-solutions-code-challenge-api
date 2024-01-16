import express, { json } from 'express'
import { createUserRouter } from './routes/users.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

export const app = express()

export const createApp = ({ userModel }) => {
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use('/users', createUserRouter({ userModel }))

  const PORT = process.env.PORT ?? 3002

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
  })
}
