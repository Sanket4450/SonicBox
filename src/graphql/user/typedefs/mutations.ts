export default `#graphql
    type Mutation {
        createUser(input: createUserInput!): UserIdAndTokens!
        resetPassword(input: resetPasswordInput!): SuccessResponse!
    }
`
