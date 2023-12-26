import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import albumValidation from '../../../validations/album'
import fields from '../fields/queries'
import constants from '../../../constants'
import albumService from '../../../services/album'

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
