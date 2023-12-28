export default `#graphql
    type Mutation {
        createAlbum(input: createAlbumInput!): createAlbumData!
        createSong(input: createSongInput!): createSongData!
        createPlaylist(input: createPlaylistInput!): createPlaylistData!
        createCategory(input: createCategoryInput!): createCategoryData!
        updateAlbum(albumId: String! input: updateAlbumInput!): updateAlbumData!
        updateSong(songId: String! input: updateSongInput!): updateSongData!
        updatePlaylist(playlistId: String! input: updatePlaylistInput!): updatePlaylistData!
        addRemoveSong(input: addRemoveSongInput!): addRemoveSongData!
        updateCategory(categoryId: String! input: updateCategoryInput!): updateCategoryData!
        addRemovePlaylist(input: addRemovePlaylistInput!): addRemovePlaylistData!
        deleteAlbum(albumId: String!): SuccessResponse!
        deleteSong(songId: String!): SuccessResponse!
        deletePlaylist(playlistId: String!): SuccessResponse!
        deleteCategory(categoryId: String!): SuccessResponse!
    }
`
