export default `#graphql
    type Mutation {
        createUser(input: createUserInput!): loginData!
        loginUser(input: loginUserInput!): loginData!
        resetForgotPassword(input: resetForgotPasswordInput!): SuccessResponse!
        resetPassword(input: resetPasswordInput!): SuccessResponse!
        logoutUser: SuccessResponse!
        followUser(input: followUserInput!): SuccessResponse!
        updateUser(input: updateUserInput!): SuccessResponse!
    }
`
