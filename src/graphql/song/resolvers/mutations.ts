import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import albumValidation from '../../../validations/album'
import songValidation from '../../../validations/song'
import plalistValidation from '../../../validations/playlist'
import fields from '../fields/mutations'
import constants from '../../../constants'
import albumService from '../../../services/album'
import songService from '../../../services/song'
import playlistService from '../../../services/playlist'

export default {
    createAlbum: async (_: any, { input }: createAlbumInput, { token }: any, info: GraphQLResolveInfo): Promise<albumData> => {
        try {
            validateSchema(input, albumValidation.createAlbum)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createAlbum)

            const { _id, name, artistId, image } = await albumService.createAlbum(token, input)

            return { albumId: _id, name, artistId, image }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    createSong: async (_: any, { input }: createSongInput, { token }: any, info: GraphQLResolveInfo): Promise<songData> => {
        try {
            validateSchema(input, songValidation.createSong)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createSong)

            const { _id, name, fileURL, albumId, artists } = await songService.createSong(token, input)

            return { songId: _id, name, fileURL, albumId, artists }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    createPlaylist: async (_: any, { input }: createPlaylistInput, { token }: any, info: GraphQLResolveInfo): Promise<playlistData> => {
        try {
            validateSchema(input, plalistValidation.createPlaylist)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createPlaylist)

            const { _id, name, userId, image, description, isPrivate } = await playlistService.createPlaylist(token, input)

            return { playlistId: _id, name, userId, image, description, isPrivate }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    }
}

interface createAlbumInput {
    input: {
        name: string
        image: string
    }
}

interface albumData {
    albumId: string
    name: string
    artistId: string
    image: string
}

interface createSongInput {
    input: {
        name: string
        fileURL: string
        albumId: string
        artists: string[]
    }
}

interface songData {
    songId: string
    name: string
    fileURL: string
    albumId: string
    artists: string[]
}

interface createPlaylistInput {
    input: {
        name: string
        image?: string
        description?: string,
        isPrivate?: boolean
    }
}

interface playlistData {
    playlistId: string
    name: string
    userId: string
    image: string
    description: string
    isPrivate: boolean
}
