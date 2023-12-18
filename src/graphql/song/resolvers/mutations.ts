import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import albumValidation from '../../../validations/album'
import songValidation from '../../../validations/song'
import plalistValidation from '../../../validations/playlist'
import categoryValidation from '../../../validations/category'
import fields from '../fields/mutations'
import constants from '../../../constants'
import albumService from '../../../services/album'
import songService from '../../../services/song'
import playlistService from '../../../services/playlist'
import categoryService from '../../../services/category'

export default {
    createAlbum: async (_: any, { input }: createAlbumInput, { token }: any, info: GraphQLResolveInfo): Promise<albumData> => {
        try {
            validateSchema(input, albumValidation.createAlbum)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createAlbum)

            const album = await albumService.createAlbum(token, input)

            return { albumId: album._id, ...album }
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

            const song = await songService.createSong(token, input)

            return { songId: song._id, ...song }
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

            const playlist = await playlistService.createPlaylist(token, input)

            return { playlistId: playlist._id, ...playlist }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    createCategory: async (_: any, { input }: createCategoryInput, { token }: any, info: GraphQLResolveInfo): Promise<categoryData> => {
        try {
            validateSchema(input, categoryValidation.createCategory)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createCategory)

            const category = await categoryService.createCategory(token, input)

            return { categoryId: category._id, ...category }
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
        description?: string
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

interface createCategoryInput {
    input: {
        name: string
        image?: string
        description?: string
        parent_categoryId?: string
        playlists?: string[]
    }
}

interface categoryData {
    categoryId: string
    name: string
    image: string
    description: string
    parent_categoryId: string
    playlists: string[]
}
