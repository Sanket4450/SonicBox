export default `#graphql
    type Query {
        albums(input: albumsInput): [AlbumWithArtist]!
        album(id: String!): AlbumWithArtistAndSongs!
    }
`
