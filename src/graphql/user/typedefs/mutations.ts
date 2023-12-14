export default `#graphql
    type Mutation {
        createUser(input: createUserInput!): loginData!
        loginUser(input: loginUserInput!): loginData!
        resetForgotPassword(input: resetForgotPasswordInput!): SuccessResponse!
        logoutUser(sessionId: String!): SuccessResponse!
    }
`
