export default `#graphql
    type Query {
        loginUser(input: loginUserInput!): UserIdAndTokens!
        requestReset(email: String!): ResetToken!
        verifyResetOtp(input: verifyResetOtpInput!): SuccessResponse!
        refreshAuthTokens(token: String!): AuthTokens!
    }
`
