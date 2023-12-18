import { GraphQLError } from 'graphql'
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
                    code: 'NOT_FOUND'
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

export default {
    createCategory
}
