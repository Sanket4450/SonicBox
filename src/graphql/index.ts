import { ApolloServer } from '@apollo/server'

const createGraphQLServer = async () => {
    const gqlserver = new ApolloServer({
        typeDefs: `
                type Query {

                },
                type Mutation {

                }
        `,
        resolvers: {
            Query: {},
            Mutation: {}
        }
    })

    await gqlserver.start()

    return gqlserver
}

export default createGraphQLServer
