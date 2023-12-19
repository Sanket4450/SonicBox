import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import songService from './song'

const getPlaylistById = async (_id: string): Promise<{ _id: string } | null> => {
    const query = {
        _id
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.PLAYLIST, { query, data })
}

const getPlaylistByIdAndUser = async (_id: string, userId: string): Promise<{ _id: string } | null> => {
    const query = {
        _id,
        userId
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.PLAYLIST, { query, data })
}

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

const addSong = async (playlistId: string, songId: string): Promise<void> => {
    const query = {
        $and: [
            { _id: playlistId },
            { songs: { $ne: new mongoose.Types.ObjectId(songId) } }
        ]
    }

    const data = {
        $push: {
            songs: new mongoose.Types.ObjectId(songId)
        }
    }

    await DbRepo.updateOne(constants.COLLECTIONS.PLAYLIST, { query, data })
}

const removeSong = async (playlistId: string, songId: string): Promise<void> => {
    const query = {
        $and: [
            { _id: playlistId },
            { songs: new mongoose.Types.ObjectId(songId) }
        ]
    }

    const data = {
        $pull: {
            songs: new mongoose.Types.ObjectId(songId)
        }
    }

    await DbRepo.updateOne(constants.COLLECTIONS.PLAYLIST, { query, data })
}

const updatePlaylist = async (token: string, { playlistId, input }: updatePlaylistParams): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getPlaylistById(playlistId)) {
            throw new GraphQLError(constants.MESSAGES.PLAYLIST_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getPlaylistByIdAndUser(playlistId, sub)) {
            throw new GraphQLError(constants.MESSAGES.PLAYLIST_NOT_EXIST, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        if (input.addSong) {
            if (!await songService.getSongById(input.addSong)) {
                throw new GraphQLError(constants.MESSAGES.SONG_NOT_FOUND, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }
            else {
                await addSong(playlistId, input.addSong)
            }
        }

        if (input.removeSong) {
            if (!await songService.getSongById(input.removeSong)) {
                throw new GraphQLError(constants.MESSAGES.SONG_NOT_FOUND, {
                    extensions: {
                        code: 'NOT_FOUND'
                    }
                })
            }
            else {
                await removeSong(playlistId, input.removeSong)
            }
        }

        delete input.addSong
        delete input.removeSong

        const query = {
            _id: playlistId
        }

        const data = {
            $set: {
                ...input
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.PLAYLIST, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
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

export default {
    getPlaylistById,
    getPlaylistByIdAndUser,
    createPlaylist,
    updatePlaylist
}
