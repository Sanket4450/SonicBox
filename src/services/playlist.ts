import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import songService from './song'
import categoryService from './category'
import libraryService from './library'

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

const getFullPlaylistById = async (_id: string): Promise<updatePlaylistData> => {
    const query = {
        _id
    }

    const data = {}

    return DbRepo.findOne(constants.COLLECTIONS.PLAYLIST, { query, data })
}

const checkPlaylistPrivate = async (_id: string): Promise<{ isPrivate: 1 }> => {
    const query = {
        _id
    }

    const data = {
        isPrivate: 1,
        _id: 0
    }

    return DbRepo.findOne(constants.COLLECTIONS.PLAYLIST, { query, data })
}

const removeAllSongs = async (songId: string): Promise<void> => {
    const query = {
        songs: new mongoose.Types.ObjectId(songId)
    }

    const data = {
        $pull: {
            songs: new mongoose.Types.ObjectId(songId)
        }
    }

    await DbRepo.updateMany(constants.COLLECTIONS.PLAYLIST, { query, data })
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

const updatePlaylist = async (token: string, { playlistId, input }: updatePlaylistParams): Promise<updatePlaylistData> => {
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

        const query = {
            _id: playlistId
        }

        const data = {
            $set: {
                ...input
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.PLAYLIST, { query, data })

        return getFullPlaylistById(playlistId)
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
    }
}

interface updatePlaylistData {
    _id: string
    name: string
    image: string
    description: string
    isPrivate: boolean
}

const addSong = async (token: string, { playlistId, songId }: addRemoveSong): Promise<void> => {
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

    if (!await songService.getSongById(songId)) {
        throw new GraphQLError(constants.MESSAGES.SONG_NOT_FOUND, {
            extensions: {
                code: 'NOT_FOUND'
            }
        })
    }

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

const removeSong = async (token: string, { playlistId, songId }: addRemoveSong): Promise<void> => {
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

    if (!await songService.getSongById(songId)) {
        throw new GraphQLError(constants.MESSAGES.SONG_NOT_FOUND, {
            extensions: {
                code: 'NOT_FOUND'
            }
        })
    }
    
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

interface addRemoveSong {
    playlistId: string
    songId: string
}

const deletePlaylist = async (token: string, playlistId: string): Promise<void> => {
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
            throw new GraphQLError(constants.MESSAGES.CANNOT_MODIFY_RESOURCE, {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
        }

        const query = {
            _id: playlistId
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.PLAYLIST, { query })

        await categoryService.removeAllPlaylists(playlistId)

        await libraryService.removeAllPlaylists(playlistId)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

export default {
    getPlaylistById,
    getPlaylistByIdAndUser,
    checkPlaylistPrivate,
    removeAllSongs,
    createPlaylist,
    updatePlaylist,
    addSong,
    removeSong,
    deletePlaylist
}
