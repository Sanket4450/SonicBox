import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import albumValidation from '../../../validations/album'
import songValidation from '../../../validations/song'
import playlistValidation from '../../../validations/playlist'
import categoryValidation from '../../../validations/category'
import fields from '../fields/queries'
import constants from '../../../constants'
import albumService from '../../../services/album'
import songService from '../../../services/song'
import playlistService from '../../../services/playlist'
import categoryService from '../../../services/category'

export default {
    albums: async (_: any, { input }: albumsInput, __: any, info: GraphQLResolveInfo): Promise<album[]> => {
        try {
            validateSchema(input, albumValidation.albums)

            validateSelection(info.fieldNodes[0].selectionSet, fields.albums)

            const albums = await albumService.getAlbums(input)

            return albums
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    album: async (_: any, { id }: id, __: any, info: GraphQLResolveInfo): Promise<singleAlbum> => {
        try {
            validateSchema({ id }, albumValidation.album)

            validateSelection(info.fieldNodes[0].selectionSet, fields.album)

            const [album] = await albumService.getSingleAlbum(id)

            return album
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    songs: async (_: any, { input }: songsInput, __: any, info: GraphQLResolveInfo): Promise<songWithArtists[]> => {
        try {
            validateSchema(input, songValidation.songs)

            validateSelection(info.fieldNodes[0].selectionSet, fields.songs)

            const songs = await songService.getSongs(input)

            return songs
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    song: async (_: any, { id }: id, __: any, info: GraphQLResolveInfo): Promise<singleSong> => {
        try {
            validateSchema({ id }, songValidation.song)

            validateSelection(info.fieldNodes[0].selectionSet, fields.song)

            const [song] = await songService.getSingleSong(id)

            return song
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },
}

interface albumsInput {
    input: {
        keyword?: string
        page?: number
        limit?: number
    }
}

interface album {
    albumId: string
    name: string
    image: string
    artist: artist
}

interface artist {
    artistId: string
    username: string
    name: string
    gender: string
    dateOfBirth: string
    state: string
    country: string
    profile_picture: string
    description: string
    isVerified: boolean
}

interface id {
    id: string
}

interface singleAlbum {
    albumId: string
    name: string
    image: string
    artist: artist
    songs: song[]
}

interface song {
    songId: string
    name: string
    fileURL: string
}

interface songsInput {
    input: {
        keyword?: string
        page?: number
        limit?: number
    }
}

interface songWithArtists {
    songId: string
    name: string
    fileURL: string
    artists: artist[]
}

interface singleSong {
    songId: string
    name: string
    fileURL: string
    album: album
    artists: artist[]
}
