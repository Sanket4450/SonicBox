export default `#graphql
    type Mutation {
        createAlbum(input: createAlbumInput): createAlbumData!
        createSong(input: createSongInput!): createSongData!
        createPlaylist(input: createPlaylistInput!): createPlaylistData!
        createCategory(input: createCategoryInput!): createCategoryData!
        updateAlbum(albumId: String! input: updateAlbumInput!): updateAlbumData!
        updateSong(songId: String! input: updateSongInput!): updateSongData!
        updatePlaylist(playlistId: String! input: updatePlaylistInput!): updatePlaylistData!
        addSong(input: addRemoveSongInput!): SuccessResponse!
        removeSong(input: addRemoveSongInput!): SuccessResponse!
        updateCategory(categoryId: String! input: updateCategoryInput!): updateCategoryData!
        addPlaylist(input: addRemovePlaylistInput!): SuccessResponse!
        removePlaylist(input: addRemovePlaylistInput!): SuccessResponse!
    }
`
