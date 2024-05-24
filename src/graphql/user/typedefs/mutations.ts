export default `#graphql
    type Mutation {
        createUser(input: createUserInput!): loginData!
        loginUser(input: loginUserInput!): loginData!
        resetForgotPassword(input: resetForgotPasswordInput!): SuccessResponse!
        resetPassword(input: resetPasswordInput!): SuccessResponse!
        followUnfollowUser(input: followUnfollowUserInput!): followUnfollowUserData!
        updateUser(input: updateUserInput!): updateUserData!
        addRemoveLibraryPlaylist(input: addRemoveLibraryPlaylistInput!): addRemoveLibraryPlaylistData!
        addRemoveLibraryArtist(input: addRemoveLibraryArtistInput!): addRemoveLibraryArtistData!
        addRemoveLibraryAlbum(input: addRemoveLibraryAlbumInput!): addRemoveLibraryAlbumData!
        deleteUser: SuccessResponse!
        verifyUser(input: verifyUserInput!): verifyUserData!
    }
`
