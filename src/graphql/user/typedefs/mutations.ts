export default `#graphql
    type Mutation {
        createUser(input: createUserInput!): loginData!
        loginUser(input: loginUserInput!): loginData!
        resetForgotPassword(input: resetForgotPasswordInput!): SuccessResponse!
        resetPassword(input: resetPasswordInput!): SuccessResponse!
        logoutUser: SuccessResponse!
        followUnfollowUser(input: followUnfollowUserInput!): followUnfollowUserData!
        updateUser(input: updateUserInput!): updateUserData!
        addLibraryPlaylist(playlistId: String!): SuccessResponse!
        removeLibraryPlaylist(playlistId: String!): SuccessResponse!
        addLibraryArtist(artistId: String!): SuccessResponse!
        removeLibraryArtist(artistId: String!): SuccessResponse!
        addLibraryAlbum(albumId: String!): SuccessResponse!
        removeLibraryAlbum(albumId: String!): SuccessResponse!
        deleteUser: SuccessResponse!
        verifyUser(input: verifyUserInput!): verifyUserData!
    }
`
