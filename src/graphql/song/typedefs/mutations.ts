export default `#graphql
    type Mutation {
        createAlbum(input: createAlbumInput): createAlbumData!
        createSong(input: createSongInput!): createSongData!
        createPlaylist(input: createPlaylistInput!): createPlaylistData!
        createCategory(input: createCategoryInput!): createCategoryData!
        updateAlbum(albumId: String! input: updateAlbumInput!): SuccessResponse!
        updateSong(songId: String! input: updateSongInput!): SuccessResponse!
    }
`
