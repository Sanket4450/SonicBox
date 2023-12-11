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
        description: String
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

    type getUserIdAndTokens {
        _id: ID!,
        accessToken: String!,
        refreshToken: String!
    }

    input loginUserInput {
        username: String
        email: String,
        password: String!
    }
`
