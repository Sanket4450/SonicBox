import dotenv from 'dotenv'
dotenv.config()

import { expressMiddleware } from '@apollo/server/express4'
import express, { Express } from 'express'
import cors from 'cors'
import connectDB from './config'
import createGraphQLServer from './graphql/index'
import { setContext } from './context'

const init = async () => {
  const app: Express = express()
  const gqlserver = await createGraphQLServer()
  const port: number = parseInt(process.env.PORT || '4000')

  connectDB()

  app.use(cors<cors.CorsRequest>())
  app.use(express.json())

  app.get('/', (_, res) => {
    res.send('App is running...')
  })

  app.use(
    '/graphql',
    expressMiddleware(gqlserver, {
      context: setContext,
    })
  )

  app.use((_, res) => {
    res.json({ success: 'false', message: 'Route not found' })
  })

  app.listen(port, () => {
    console.log(`Server is listening on PORT: ${port}`)
  })
}

init()
