import { ApolloServer } from '@apollo/server'
import user from './user/index'

export default async function createGraphQLServer() {
    const gqlserver = new ApolloServer({
        typeDefs: `
            ${user.typeDefs}
        `,
        resolvers: {
            Query: {
                ...user.queryResolvers
            },
            Mutation: {
                ...user.mutationResolvers
            }
        }
    })

    await gqlserver.start()

    return gqlserver
}
