export default `#graphql
    type Mutation {
        createAlbum(input: createAlbumInput): createAlbumData!
        createSong(input: createSongInput!): createSongData!
        createPlaylist(input: createPlaylistInput!): createPlaylistData!
        createCategory(input: createCategoryInput!): createCategoryData!
        updateAlbum(albumId: String! input: updateAlbumInput!): updateAlbumData!
        updateSong(songId: String! input: updateSongInput!): updateSongData!
        updatePlaylist(playlistId: String! input: updatePlaylistInput!): updatePlaylistData!
        updateCategory(categoryId: String! input: updateCategoryInput!): updateCategoryData!
    }
`
