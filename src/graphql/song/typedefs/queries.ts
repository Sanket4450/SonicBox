export default `#graphql
    type Query {
        albums(input: albumsInput): [AlbumWithArtist]!
        album(id: String!): AlbumWithArtistAndSongs!
        songs(input: songsInput): [SongWithArtists]!
        song(id: String!): SongWithAlbumAndArtists!
    }
`
