export default `#graphql
    type Query {
        albums(input: albumsInput): [AlbumWithArtist]!
        album(id: String!): AlbumWithArtistAndSongs!
        songs(input: songsInput): [SongWithArtists]!
        song(id: String!): SongWithAlbumAndArtists!
        playlists(input: playlistsInput): [PublicPlaylist]!
        playlist(id: String!): PlaylistWithUserAndSongs!
        categories(input: categoryInput): [Category]!
        category(id: String!): FullCategory!
    }
`
