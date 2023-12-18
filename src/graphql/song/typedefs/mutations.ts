export default `#graphql
    type Mutation {
        createAlbum(input: createAlbumInput): createAlbumData!
        createSong(input: createSongInput!): createSongData!
        createPlaylist(input: createPlaylistInput!): createPlaylistData!
    }
`
