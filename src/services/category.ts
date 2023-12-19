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

const addPlaylist = async (categoryId: string, playlistId: string): Promise<void> => {
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
}

const removePlaylist = async (categoryId: string, playlistId: string): Promise<void> => {
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
}

const updateCategory = async (token: string, { categoryId, input }: updateCategoryParams): Promise<void> => {
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

        if (input.addPlaylist) {
            if (!await playlistService.getPlaylistById(input.addPlaylist)) {
                throw new GraphQLError(constants.MESSAGES.PLAYLIST_NOT_FOUND, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }

            if (!await playlistService.getPlaylistByIdAndUser(input.addPlaylist, sub)) {
                throw new GraphQLError(constants.MESSAGES.ONLY_ADMIN_PLAYLISTS_ALLOWED, {
                    extensions: {
                        code: 'CONFLICT'
                    }
                })
            }

            else {
                await addPlaylist(categoryId, input.addPlaylist)
            }
        }

        if (input.removePlaylist) {
            if (!await playlistService.getPlaylistById(input.removePlaylist)) {
                throw new GraphQLError(constants.MESSAGES.PLAYLIST_NOT_FOUND, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }
            
            else {
                await removePlaylist(categoryId, input.removePlaylist)
            }
        }

        delete input.addPlaylist
        delete input.removePlaylist

        const query = {
            _id: categoryId
        }

        const data = {
            $set: {
                ...input
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

export default {
    createCategory,
    updateCategory
}
