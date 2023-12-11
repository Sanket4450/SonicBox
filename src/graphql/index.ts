import { ApolloServer } from '@apollo/server'
import { ApolloServerErrorCode } from '@apollo/server/errors'
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
        },
        formatError: (formattedError, error) => {
            // Return a different error message
            if (formattedError.extensions?.code === ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED) {
                
                return {
                    ...formattedError,
                    message: "Your query doesn't match the schema. Try double-checking it!",
                };
            }

            // Otherwise return the formatted error. This error can also
            // be manipulated in other ways, as long as it's returned.
            return formattedError;
        },
    })

    await gqlserver.start()

    return gqlserver
}
