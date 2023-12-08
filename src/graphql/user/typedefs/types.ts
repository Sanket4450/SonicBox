export default `#graphql
    type UserType {
        id: ID!,
        username: String!,
        name: String,
        email: String!,
        gender: genderType,
        dateOfBirth: String,
        state: String,
        country: String,
        profile_picture: String,
        description: String,
        isVerified: Boolean
    }

    enum genderType {
        male,
        female,
        other
    }

    enum roleType {
        user,
        artist,
        admin
    }

    type TokenType {
        accessToken: String!,
        refreshToken: String!
    }

    type getUserAndTokens {
        user: UserType!,
        tokens: TokenType!
    }
`
