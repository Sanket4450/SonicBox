export default `#graphql
    type Query {
        requestReset(input: requestResetInput!): ResetToken!
        verifyResetOtp(input: verifyResetOtpInput!): SuccessResponse!
        refreshAuthTokens(token: String!): AuthTokens!
        users(input: usersInput): [User]!
        user(id: String!): SingleUser!
        profile: profile!
    }
`
