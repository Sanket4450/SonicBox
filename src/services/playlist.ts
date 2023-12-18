import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'

const getPlaylistByNameAndUser = async (name: string, userId: string): Promise<{ _id: string } | null> => {
    const query = {
        name: { $regex: name, $options: 'i' },
        userId
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.PLAYLIST, { query, data })
}

const createPlaylist = async (token: string, input: playlistInput): Promise<playlistData> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (await getPlaylistByNameAndUser(input.name, sub)) {
            throw new GraphQLError(constants.MESSAGES.PLAYLIST_ALREADY_EXISTS, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        input.image ||= 'https://picsum.photos/280'
        input.isPrivate ||= false

        // upload image to cloud & get url from there

        const data = {
            ...input,
            userId: new mongoose.Types.ObjectId(sub)
        }

        return DbRepo.create(constants.COLLECTIONS.PLAYLIST, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface playlistInput {
    name: string
    image?: string
    description?: string
    isPrivate?: boolean
}

interface playlistData {
    _id: string
    name: string
    userId: string
    image: string
    description: string
    isPrivate: boolean
}

export default {
    createPlaylist
}
