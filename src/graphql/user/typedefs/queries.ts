export default `#graphql
    type Query {
        requestReset(input: requestResetInput!): ResetToken!
        verifyResetOtp(input: verifyResetOtpInput!): SuccessResponse!
        refreshAuthTokens(token: String!): AuthTokens!
        users(input: usersInput): [User]!
        user(userId: String!): SingleUser!
    }
`
