export default `#graphql
    input createAlbumInput {
        name: String!
        image: String!
    }

    type createAlbumData {
        albumId: String!,
        name: String,
        artistId: String,
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
        artists: [String!]
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
        playlists: [String!]
    }

    type createCategoryData {
        categoryId: String!
        name: String
        image: String
        description: String
        parent_categoryId: String
        playlists: [String!]
    }
`
