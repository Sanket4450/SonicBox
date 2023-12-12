export default `#graphql
    type Mutation {
        createUser(input: createUserInput!): UserIdAndTokens!
        resetForgotPassword(input: resetForgotPasswordInput!): SuccessResponse!
    }
`
