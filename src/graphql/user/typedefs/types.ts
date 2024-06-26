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
        profileImage: String
        description: String
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
    }

    input requestResetInput {
        email: String!
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

    input followUnfollowUserInput {
        userId: String!
        isFollowed: Boolean!
    }

    type followUnfollowUserData {
        isFollowed: Boolean!
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
        profileImage: String
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
        profileImage: String
        description: String
        isVerified: Boolean
    }

    input addRemoveLibraryPlaylistInput {
        playlistId: String!
        isAdded: Boolean!
    }

    type addRemoveLibraryPlaylistData {
        isAdded: Boolean!
    }

    input addRemoveLibraryArtistInput {
        artistId: String!
        isAdded: Boolean!
    }

    type addRemoveLibraryArtistData {
        isAdded: Boolean!
    }

    input addRemoveLibraryAlbumInput {
        albumId: String!
        isAdded: Boolean!
    }

    type addRemoveLibraryAlbumData {
        isAdded: Boolean!
    }

    input usersInput {
        keyword: String
        page: Int = 1
        limit: Int = 10
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
        profileImage: String
        description: String
        isVerified: Boolean
        followersCount: Int
        followingsCount: Int
    }

    type UserData {
        userId: String!
        username: String
        name: String
        email: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profileImage: String
        description: String
        isVerified: Boolean
    }

    type SingleUser {
        userId: String!
        username: String
        name: String
        email: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profileImage: String
        description: String
        isVerified: Boolean
        followers(page: Int = 1, limit: Int = 10): [UserData]!
        followersCount: Int
        followings(page: Int = 1, limit: Int = 10): [UserData]!
        followingsCount: Int
        playlists(page: Int = 1, limit: Int = 10): [PublicPlaylist]!
    }

    type profile {
        userId: String!
        username: String
        name: String
        email: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profileImage: String
        description: String
        isVerified: Boolean
        followers(page: Int = 1, limit: Int = 10): [UserData]!
        followersCount: Int
        followings(page: Int = 1, limit: Int = 10): [UserData]!
        followingsCount: Int
        playlists(page: Int = 1, limit: Int = 10): [Playlist]!
        libraryPlaylists(page: Int = 1, limit: Int = 10): [Playlist]!
        libraryArtists(page: Int = 1, limit: Int = 10): [Artist]!
        libraryAlbums(page: Int = 1, limit: Int = 10): [Album]!
    }

    input artistsInput {
        keyword: String
        page: Int = 1
        limit: Int = 10
    }

    type Artist {
        artistId: String!
        username: String
        name: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profileImage: String
        description: String
        isVerified: Boolean
        followersCount: Int
        followingsCount: Int
    }

    type ArtistData {
        artistId: String!
        username: String
        name: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profileImage: String
        description: String
        isVerified: Boolean
    }

    type SingleArtist {
        artistId: String!
        username: String
        name: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profileImage: String
        description: String
        isVerified: Boolean
        followers(page: Int = 1, limit: Int = 10): [UserData]!
        followersCount: Int
        followings(page: Int = 1, limit: Int = 10): [UserData]!
        followingsCount: Int
        playlists(page: Int = 1, limit: Int = 10): [PublicPlaylist]!
    }

    input verifyUserInput {
        userId: String!
        isVerified: Boolean!
    }

    type verifyUserData {
        isVerified: Boolean!
    }
`
