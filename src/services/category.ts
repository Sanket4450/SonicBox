import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import playlistService from './playlist'

const getCategoryById = async (_id: string): Promise<{ _id: string } | null> => {
    const query = {
        _id
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.CATEGORY, { query, data })
}

const getFullCategory = async (_id: string): Promise<updateCategoryData> => {
    const query = {
        _id
    }

    const data = {}

    return DbRepo.findOne(constants.COLLECTIONS.CATEGORY, { query, data })
}

const removeAllPlaylists = async (playlistId: string): Promise<void> => {
    try {
        const query = {
            playlists: new mongoose.Types.ObjectId(playlistId)
        }

        const data = {
            $pull: {
                playlists: new mongoose.Types.ObjectId(playlistId)
            }
        }

        await DbRepo.updateMany(constants.COLLECTIONS.CATEGORY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const createCategory = async (token: string, input: categoryInput): Promise<categoryData> => {
    try {
        const { sub, role } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (role !== 'admin') {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_ALLOWED, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        if (input.parent_categoryId && !await getCategoryById(input.parent_categoryId)) {
            throw new GraphQLError(constants.MESSAGES.CATEGORY_NOT_EXIST, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        if (input.playlists?.length) {
            for (let playlistId of input.playlists) {
                if (!await playlistService.getPlaylistByIdAndUser(playlistId, sub)) {
                    throw new GraphQLError(constants.MESSAGES.ONLY_ADMIN_PLAYLISTS_ALLOWED, {
                        extensions: {
                            code: 'CONFLICT'
                        }
                    })
                }
            }
        }

        const data = {
            ...input
        }

        return DbRepo.create(constants.COLLECTIONS.CATEGORY, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface categoryInput {
    name: string
    image?: string
    description?: string,
    parent_categoryId?: string
    playlists?: string[]
}

interface categoryData {
    _id: string
    name: string
    image: string
    description: string,
    parent_categoryId: string
    playlists: string[]
}

const updateCategory = async (token: string, { categoryId, input }: updateCategoryParams): Promise<updateCategoryData> => {
    try {
        const { sub, role } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (role !== 'admin') {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_ALLOWED, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        if (!await getCategoryById(categoryId)) {
            throw new GraphQLError(constants.MESSAGES.CATEGORY_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            _id: categoryId
        }

        const data = {
            $set: {
                ...input
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.CATEGORY, { query, data })

        return getFullCategory(categoryId)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface updateCategoryParams {
    categoryId: string
    input: {
        name?: string
        image?: string
        description?: string
    }
}

interface updateCategoryData {
    _id: string
    name: string
    image: string
    description: string
    parent_categoryId: string
}

const addPlaylist = async (token: string, { categoryId, playlistId }: addRemovePlaylist): Promise<void> => {
    try {
        const { sub, role } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (role !== 'admin') {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_ALLOWED, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        if (!await getCategoryById(categoryId)) {
            throw new GraphQLError(constants.MESSAGES.CATEGORY_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await playlistService.getPlaylistById(playlistId)) {
            throw new GraphQLError(constants.MESSAGES.PLAYLIST_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            $and: [
                { _id: categoryId },
                { playlists: { $ne: new mongoose.Types.ObjectId(playlistId) } }
            ]
        }

        const data = {
            $push: {
                playlists: new mongoose.Types.ObjectId(playlistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.CATEGORY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removePlaylist = async (token: string, { categoryId, playlistId }: addRemovePlaylist): Promise<void> => {
    try {
        const { sub, role } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (role !== 'admin') {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_ALLOWED, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        if (!await getCategoryById(categoryId)) {
            throw new GraphQLError(constants.MESSAGES.CATEGORY_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await playlistService.getPlaylistById(playlistId)) {
            throw new GraphQLError(constants.MESSAGES.PLAYLIST_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            $and: [
                { _id: categoryId },
                { playlists: new mongoose.Types.ObjectId(playlistId) }
            ]
        }

        const data = {
            $pull: {
                playlists: new mongoose.Types.ObjectId(playlistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.CATEGORY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface addRemovePlaylist {
    categoryId: string
    playlistId: string
}

const deleteCategory = async (token: string, categoryId: string): Promise<void> => {
    try {
        const { sub, role } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (role !== 'admin') {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_ALLOWED, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        if (!await getCategoryById(categoryId)) {
            throw new GraphQLError(constants.MESSAGES.CATEGORY_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            _id: categoryId
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.CATEGORY, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getCategories = async (input: categoriesInput = {}): Promise<category[]> => {
    try {
        const page: number = input.page || 1
        const limit: number = input.limit || 10

        const pipeline: object[] = [
            {
                $skip: ((page - 1) * limit)
            },
            {
                $limit: limit
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    description: 1,
                    _id: 0,
                    categoryId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.CATEGORY, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface categoriesInput {
    page?: number
    limit?: number
}

interface category {
    categoryId: string
    name: string
    image: string
    description: string
}

const getSingleCategory = async (categoryId: string): Promise<singleCategory[]> => {
    try {
        const pipeline: object[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(categoryId)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: 'parent_categoryId',
                    as: 'childCategories'
                }
            },
            {
                $lookup: {
                    from: 'playlists',
                    localField: 'playlists',
                    foreignField: '_id',
                    as: 'playlists'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    image: { $first: '$image' },
                    description: { $first: '$description' },
                    childCategories: { $first: '$childCategories' },
                    playlists: { $first: '$playlists' }
                }
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    description: 1,
                    _id: 0,
                    categoryId: '$_id',
                    childCategories: {
                        $map: {
                            input: '$childCategories',
                            as: 'childCategory',
                            in: {
                                categoryId: '$$childCategory._id',
                                name: '$$childCategory.name',
                                image: '$$childCategory.image',
                                description: '$$childCategory.description'
                            }
                        }
                    },
                    playlists: {
                        $map: {
                            input: '$playlists',
                            as: 'playlist',
                            in: {
                                playlistId: '$$playlist._id',
                                name: '$$playlist.name',
                                image: '$$playlist.image',
                                description: '$$playlist.description'
                            }
                        }
                    }
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.CATEGORY, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface singleCategory {
    categoryId: string
    name: string
    image: string
    description: string
    childCategories: category[]
    playlists: playlist[]
}

interface category {
    categoryId: string
    name: string
    image: string
    description: string
}

interface playlist {
    playlistId: string
    name: string
    image: string
    description: string
}

export default {
    removeAllPlaylists,
    createCategory,
    updateCategory,
    addPlaylist,
    removePlaylist,
    deleteCategory,
    getCategories,
    getSingleCategory
}
