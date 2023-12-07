import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import cors from 'cors'
import createGraphQLServer from './graphql/index'

const init = async () => {
    const app = express()
    const gqlserver = await createGraphQLServer()
    const port = process.env.PORT || 4000

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
