export default `#graphql
    type SuccessResponse {
        success: Boolean!
    }

    input createAlbumInput {
        name: String!
        image: String!
    }

    type createAlbumData {
        albumId: String!
        name: String
        artistId: String
        image: String
    }

    input createSongInput {
        name: String!
        fileURL: String!
        albumId: String!
        artists: [String!]!
    }

    type createSongData {
        songId: String!
        name: String
        fileURL: String
        albumId: String
        artists: [String]
    }

    input createPlaylistInput {
        name: String!
        image: String
        description: String
        isPrivate: Boolean
    }

    type createPlaylistData {
        playlistId: String!
        name: String
        userId: String
        image: String
        description: String
        isPrivate: Boolean
    }

    input createCategoryInput {
        name: String!
        image: String
        description: String
        parent_categoryId: String
        playlists: [String]
    }

    type createCategoryData {
        categoryId: String!
        name: String
        image: String
        description: String
        parent_categoryId: String
        playlists: [String]
    }

    input updateAlbumInput {
        name: String
        image: String
    }

    type updateAlbumData {
        albumId: String!
        name: String
        artistId: String
        image: String
    }

    input updateSongInput {
        name: String
        fileURL: String
        addArtist: String
        removeArtist: String
    }

    type updateSongData {
        songId: String!
        name: String
        albumId: String
        fileURL: String
        listens: Int
        artists: [String]
    }

    input updatePlaylistInput {
        name: String
        image: String
        description: String
        isPrivate: Boolean
    }

    type updatePlaylistData {
        playlistId: String!
        name: String
        image: String
        description: String
        isPrivate: Boolean
    }

    input addRemoveSongInput {
        playlistId: String!
        songId: String!
    }

    input updateCategoryInput {
        name: String
        image: String
        description: String
    }

    type updateCategoryData {
        categoryId: String!
        name: String
        image: String
        description: String
        parent_categoryId: String
    }

    input addRemovePlaylistInput {
        categoryId: String!
        playlistId: String!
    }

    input CategoriesInput {
        categoryId: String!
        root: Boolean = false
        page: Int = 1
        limit: Int = 10
    }

    input albumsInput {
        keyword: String
        page: Int = 1
        limit: Int = 10
    }

    type Album {
        albumId: String!
        name: String
        image: String
    }

    type AlbumWithArtist {
        albumId: String!
        name: String
        image: String
        artist: Artist!
    }

    type AlbumWithArtistAndSongs {
        albumId: String!
        name: String
        image: String
        artist: Artist!
        songs: [Song]!
    }

    type Song {
        songId: String!
        name: String
        fileURL: String
    }

    type SongWithAlbum {
        songId: String!
        name: String
        fileURL: String
        album: Album!
    }

    type SongWithArtists {
        songId: String!
        name: String
        fileURL: String
        artists: [Artist]!
    }

    input songsInput {
        keyword: String
        page: Int = 1
        limit: Int = 10
    }

    type SongWithAlbumAndArtists {
        songId: String!
        name: String
        fileURL: String
        album: AlbumWithArtist!
        artists: [Artist]!
    }

    input playlistsInput {
        keyword: String
        page: Int = 1
        limit: Int = 10
    }

    type PlaylistWithUserAndSongs {
        playlistId: String!
        name: String
        image: String
        description: String
        user: UserFields!
        songs: [SongWithAlbum]!
    }

    type Playlist {
        playlistId: String!
        name: String
        image: String
        description: String
        isPrivate: Boolean
    }

    type PublicPlaylist {
        playlistId: String!
        name: String
        image: String
        description: String
    }

    type UserFields {
        userId: String!
        username: String
        name: String
        email: String
        gender: GenderType
        dateOfBirth: String
        state: String
        country: String
        profile_picture: String
        description: String
    }

    input categoryInput {
        page: Int = 1
        limit: Int = 10
    }

    type Category {
        categoryId: String!
        name: String
        image: String
        description: String
    }

    type FullCategory {
        categoryId: String!
        name: String
        image: String
        description: String
        childCategories: [Category]!
        playlists: [PublicPlaylist]!
    }
`
