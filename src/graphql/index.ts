import { ApolloServer } from '@apollo/server'
import { ApolloServerErrorCode } from '@apollo/server/errors'
import user from './user/index'
import song from './song/index'

export default async function createGraphQLServer() {
  const gqlserver = new ApolloServer({
    typeDefs: `
            ${user.typeDefs}
            ${song.typeDefs}
        `,
    resolvers: {
      Query: {
        ...user.queryResolvers,
        ...song.queryResolvers,
      },
      Mutation: {
        ...user.mutationResolvers,
        ...song.mutationResolvers,
      },
      ...user.parentResolvers,
    },
    formatError: (formattedError, _) => {
      if (
        formattedError.extensions?.code ===
        ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
      ) {
        return {
          ...formattedError,
          message:
            "Your query doesn't match the schema. Try double-checking it!",
        }
      }

      return formattedError
    },
  })

  await gqlserver.start()

  return gqlserver
}
