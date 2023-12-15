import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import songValidation from '../../../validations/song'
import albumValidation from '../../../validations/album'
import fields from '../fields/mutations'
import constants from '../../../constants'
import songService from '../../../services/song'
import albumService from '../../../services/album'

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

            const { _id, name, artistId, fileURL, albumId } = await songService.createSong(token, input)

            return { songId: _id, name, artistId, fileURL, albumId }
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
    }
}

interface songData {
    songId: string
    name: string
    artistId: string
    fileURL: string
    albumId: string
}
