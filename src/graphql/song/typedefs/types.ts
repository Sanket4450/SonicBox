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
    }

    type createSongData {
        songId: String!
        name: String
        artistId: String
        fileURL: String
        albumId: String
    }
`
