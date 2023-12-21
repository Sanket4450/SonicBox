export default `#graphql
    type SuccessResponse {
        success: Boolean!
    }

    input createUserInput {
        username: String!
        name: String
        email: String!
        password: String!
        gender: GenderType
        dateOfBirth: String
        role: RoleType
        secret: String
        state: String
        country: String
        profile_picture: String
        description: String
        deviceToken: String!
    }

    enum GenderType {
        male
        female
        other
    }

    enum RoleType {
        user
        artist
        admin
    }

    type loginData {
        userId: ID
        accessToken: String!
        refreshToken: String!
    }

    input loginUserInput {
        username: String
        email: String
        password: String!
        deviceToken: String!
    }

    input requestResetInput {
        email: String!
        deviceToken: String!
    }

    type ResetToken {
        resetToken: String!
    }

    input verifyResetOtpInput {
        otp: Int!
        resetToken: String!
    }

    input resetForgotPasswordInput {
        password: String!
        resetToken: String!
    }

    type AuthTokens {
        accessToken: String!
        refreshToken: String!
    }

    input resetPasswordInput {
        oldPassword: String!
        newPassword: String!
    }

    input followUserInput {
        userId: ID!
    }

    input unfollowUserInput {
        userId: ID!
    }

    input updateUserInput {
        username: String
        name: String
        email: String
        gender: GenderType
        dateOfBirth: String
        role: RoleType
        secret: String
        state: String
        country: String
        profile_picture: String
        description: String
    }

    type updateUserData {
        userId: ID!
        username: String
        name: String
        email: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profile_picture: String
        description: String
        isVerified: Boolean
    }

    type User {
        userId: String!
        username: String
        name: String
        email: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profile_picture: String
        description: String
        isVerified: Boolean
        # followings(page: String limit: String): [User]
        followingsCount: Int
        # followers(page: String limit: String): [User]
        followersCount: Int
        # playlists: [Playlist]
        # libraryPlaylists: [Playlist]
        # libraryArtists: [User]
        # libraryAlbums: [Album]
    }

    input usersInput {
        keyword: String
        page: Int = 1
        limit: Int = 10
    }
`
