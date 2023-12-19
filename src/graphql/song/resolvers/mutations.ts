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
    createAlbum: async (_: any, { input }: createAlbumInput, { token }: any, info: GraphQLResolveInfo): Promise<createAlbumData> => {
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

    createSong: async (_: any, { input }: createSongInput, { token }: any, info: GraphQLResolveInfo): Promise<createSongData> => {
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

    createPlaylist: async (_: any, { input }: createPlaylistInput, { token }: any, info: GraphQLResolveInfo): Promise<createPlaylistData> => {
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
    },

    createCategory: async (_: any, { input }: createCategoryInput, { token }: any, info: GraphQLResolveInfo): Promise<createCategoryData> => {
        try {
            validateSchema(input, categoryValidation.createCategory)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createCategory)

            const { _id, name, image, description, parent_categoryId, playlists } = await categoryService.createCategory(token, input)

            return { categoryId: _id, name, image, description, parent_categoryId, playlists }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    updateAlbum: async (_: any, args: updateAlbumParams, { token }: any, info: GraphQLResolveInfo): Promise<updateAlbumData> => {
        try {
            validateSchema(args, albumValidation.updateAlbum)

            validateSelection(info.fieldNodes[0].selectionSet, fields.updateAlbum)

            const { _id, name, artistId, image } = await albumService.updateAlbum(token, args)

            return { albumId: _id, name, artistId, image }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    updateSong: async (_: any, args: updateSongParams, { token }: any, info: GraphQLResolveInfo): Promise<updateSongData> => {
        try {
            validateSchema(args, songValidation.updateSong)

            validateSelection(info.fieldNodes[0].selectionSet, fields.updateSong)

            const { _id, name, albumId, fileURL, listens, artists } = await songService.updateSong(token, args)

            return { songId: _id, name, albumId, fileURL, listens, artists }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    updatePlaylist: async (_: any, args: updatePlaylistParams, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(args, plalistValidation.updatePlaylist)

            validateSelection(info.fieldNodes[0].selectionSet, fields.updatePlaylist)

            await playlistService.updatePlaylist(token, args)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    updateCategory: async (_: any, args: updateCategoryParams, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(args, categoryValidation.updateCategory)

            validateSelection(info.fieldNodes[0].selectionSet, fields.updateCategory)

            await categoryService.updateCategory(token, args)

            return { success: true }
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

interface createAlbumData {
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

interface createSongData {
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

interface createPlaylistData {
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

interface createCategoryData {
    categoryId: string
    name: string
    image: string
    description: string
    parent_categoryId: string
    playlists: string[]
}

interface updateAlbumParams {
    albumId: string
    input: {
        name?: string
        image?: string
    }
}

interface updateAlbumData {
    albumId: string,
    name: string,
    artistId: string,
    image: string
}

interface updateSongParams {
    songId: string
    input: {
        name?: string
        fileURL?: string
        addArtist?: string
        removeArtist?: string
    }
}

interface updateSongData {
    songId: string
    name: string
    albumId: string
    fileURL: string
    listens: number
    artists: string[]
}

interface updatePlaylistParams {
    playlistId: string
    input: {
        name?: string
        image?: string
        description?: string
        isPrivate?: boolean
        addSong?: string
        removeSong?: string
    }
}

interface updateCategoryParams {
    categoryId: string
    input: {
        name?: string
        image?: string
        description?: string
        addPlaylist?: string
        removePlaylist?: string
    }
}
