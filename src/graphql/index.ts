import { ApolloServer } from '@apollo/server'

export default async function createGraphQLServer() {
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
