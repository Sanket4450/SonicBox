import dotenv from 'dotenv'
const environment: string = process.env.NODE_ENV || 'development'
const envFilePath: string = environment === 'production' ? '.env.production' : '.env.local'
dotenv.config({ path: envFilePath })

import { expressMiddleware } from '@apollo/server/express4'
import express, { Express } from 'express'
import cors from 'cors'
import connectDB from './config'
import createGraphQLServer from './graphql/index'

const init = async () => {
    const app: Express = express()
    const gqlserver = await createGraphQLServer()
    const port: number = parseInt(process.env.PORT || '4000') || 4000

    connectDB()

    app.use(cors<cors.CorsRequest>())
    app.use(express.json())

    app.get('/', (req, res) => {
        res.send('App is running...')
    })

    app.use('/graphql', expressMiddleware(gqlserver))

    app.listen(port, () => {
        console.log(`Server is listening on PORT: ${port}`)
    })
}

init()
