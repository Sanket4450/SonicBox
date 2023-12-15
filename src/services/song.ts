import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import albumService from './album'

const getSongByAlbumAndURL = async (albumId: string, fileURL: string): Promise<{ _id: string } | null> => {
    const query = {
        albumId,
        fileURL
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.SONG, { query, data })
}

const createSong = async (token: string, input: songInput): Promise<songData> => {
    try {
        const { sub, role } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (role !== 'artist') {
            throw new GraphQLError(constants.MESSAGES.CANNOT_POST_SONG, {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
        }

        if (!await albumService.getAlbum(input.albumId, sub)) {
            throw new GraphQLError(constants.MESSAGES.ALBUM_NOT_EXIST, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        if (await getSongByAlbumAndURL(input.albumId, input.fileURL)) {
            throw new GraphQLError(constants.MESSAGES.SONG_ALREADY_EXISTS, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        // upload image & fileURL to cloud & get urls from there

        const data = {
            ...input,
            artistId: new mongoose.Types.ObjectId(sub)
        }

        return DbRepo.create(constants.COLLECTIONS.SONG, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface songInput {
    name: string
    fileURL: string
    albumId: string
}

interface songData {
    _id: string
    name: string
    artistId: string
    fileURL: string
    albumId: string
}

export default {
    createSong
}
