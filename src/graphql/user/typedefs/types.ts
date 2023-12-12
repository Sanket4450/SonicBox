export default `#graphql
    input createUserInput {
        username: String!,
        name: String,
        email: String!,
        password: String!
        gender: GenderType,
        dateOfBirth: String,
        role: RoleType,
        secret: String
        state: String,
        country: String,
        profile_picture: String,
        description: String,
        deviceToken: String!
    }

    enum GenderType {
        male,
        female,
        other
    }

    enum RoleType {
        user,
        artist,
        admin
    }

    type Tokens {
        accessToken: String!,
        refreshToken: String!
    }

    type UserIdAndTokens {
        _id: ID!,
        accessToken: String!,
        refreshToken: String!
    }

    input loginUserInput {
        username: String
        email: String,
        password: String!
        deviceToken: String!
    }

    type ResetToken {
        resetToken: String!
    }

    input verifyResetOtpInput {
        otp: Int!,
        resetToken: String!
    }

    type SuccessResponse {
        success: Boolean!
    }

    input resetForgotPasswordInput {
        password: String!,
        resetToken: String!
    }
`
