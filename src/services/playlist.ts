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
    try {
        const query = {
            songs: new mongoose.Types.ObjectId(songId)
        }

        const data = {
            $pull: {
                songs: new mongoose.Types.ObjectId(songId)
            }
        }

        await DbRepo.updateMany(constants.COLLECTIONS.PLAYLIST, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
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
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removeSong = async (token: string, { playlistId, songId }: addRemoveSong): Promise<void> => {
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
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
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

const deleteAllPlaylistsByUserId = async (userId: string): Promise<void> => {
    try {
        const query = {
            userId: new mongoose.Types.ObjectId(userId)
        }

        await DbRepo.deleteMany(constants.COLLECTIONS.PLAYLIST, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getUserPlaylists = async ({ userId, page, limit }: userIdPageAndLimit): Promise<playlist[]> => {
    try {
        page ||= 1
        limit ||= 10

        const pipeline: object[] = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    isPrivate: false
                }
            },
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
                    playlistId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.PLAYLIST, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getProfilePlaylists = async ({ userId, page, limit }: userIdPageAndLimit): Promise<playlist[]> => {
    try {
        page ||= 1
        limit ||= 10

        const pipeline: object[] = [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
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
                    isPrivate: 1,
                    _id: 0,
                    playlistId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.PLAYLIST, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface userIdPageAndLimit {
    userId: string
    page: number
    limit: number
}

interface playlist {
    playlistId: string
    name: string
    image: string
    description: string
    isPrivate: boolean
}

const getPlaylists = async (input: playlistsInput = {}): Promise<playlist[]> => {
    try {
        const keyword: string = input.keyword || ''
        const page: number = input.page || 1
        const limit: number = input.limit || 10

        const pipeline: object[] = [
            {
                $match: {
                    name: { $regex: keyword, $options: 'i' },
                    isPrivate: false
                }
            },
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
                    playlistId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.PLAYLIST, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface playlistsInput {
    keyword?: string
    page?: number
    limit?: number
}

interface playlist {
    playlistId: string
    name: string
    image: string
    description: string
}

const getSinglePlaylist = async (playlistId: string): Promise<singlePlaylist[]> => {
    try {
        const pipeline: object[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(playlistId),
                    isPrivate: false
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'songs',
                    localField: 'songs',
                    foreignField: '_id',
                    as: 'songs'
                }
            },
            {
                $unwind: {
                    path: '$songs'
                }
            },
            {
                $lookup: {
                    from: 'albums',
                    localField: 'songs.albumId',
                    foreignField: '_id',
                    as: 'songs.album'
                }
            },
            {
                $unwind: {
                    path: '$songs.album'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    image: { $first: '$image' },
                    description: { $first: '$description' },
                    user: {
                        $addToSet: {
                            userId: { $first: '$user._id' },
                            username: { $first: '$user.username' },
                            name: { $first: '$user.name' },
                            email: { $first: '$user.email' },
                            gender: { $first: '$user.ge' },
                            dateOfBirth: { $first: '$user.dateOfBirth' },
                            state: { $first: '$user.state' },
                            country: { $first: '$user.country' },
                            profile_picture: { $first: '$user.profile_picture' },
                            description: { $first: '$user.description' }
                        }
                    },
                    songs: {
                        $push: {
                            $mergeObjects: [
                                "$songs",
                                {
                                    album: "$songs.album"
                                }
                            ]
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: '$user'
                }
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    description: 1,
                    _id: 0,
                    playlistId: '$_id',
                    user: 1,
                    songs: {
                        $map: {
                            input: '$songs',
                            as: 'song',
                            in: {
                                songId: '$$song._id',
                                name: '$$song.name',
                                fileURL: '$$song.fileURL',
                                album: {
                                    albumId: '$$song.album._id',
                                    name: '$$song.album.name',
                                    image: '$$song.album.image',
                                }
                            }
                        }
                    }
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.PLAYLIST, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface singlePlaylist {
    playlistId: string
    name: string
    image: string
    description: string
    user: user
    songs: song[]
}

interface user {
    userId: string
    username: string
    name: string
    email: string
    password: string
    gender: string
    dateOfBirth: string
    state: string
    country: string
    profile_picture: string
    description: string
}

interface song {
    songId: string
    name: string
    fileURL: string
    album: album
}

interface album {
    albumId: string
    name: string
    image: string
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
    deletePlaylist,
    deleteAllPlaylistsByUserId,
    getUserPlaylists,
    getProfilePlaylists,
    getPlaylists,
    getSinglePlaylist
}
