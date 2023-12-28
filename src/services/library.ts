import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import playlistService from './playlist'
import albumService from './album'

const addPlaylist = async (userId: string, playlistId: string): Promise<void> => {
    try {
        const query = {
            $and: [
                { userId: new mongoose.Types.ObjectId(userId) },
                { playlists: { $ne: new mongoose.Types.ObjectId(playlistId) } }
            ]
        }

        const data = {
            $push: {
                playlists: new mongoose.Types.ObjectId(playlistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removePlaylist = async (userId: string, playlistId: string): Promise<void> => {
    try {
        const query = {
            $and: [
                { userId: new mongoose.Types.ObjectId(userId) },
                { playlists: new mongoose.Types.ObjectId(playlistId) }
            ]
        }

        const data = {
            $pull: {
                playlists: new mongoose.Types.ObjectId(playlistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
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

        await DbRepo.updateMany(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removeAllAlbums = async (albumId: string): Promise<void> => {
    try {
        const query = {
            albums: new mongoose.Types.ObjectId(albumId)
        }

        const data = {
            $pull: {
                albums: new mongoose.Types.ObjectId(albumId)
            }
        }

        await DbRepo.updateMany(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const addRemoveLibraryPlaylist = async (token: string, { playlistId, isAdded }: addRemoveLibraryPlaylist): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
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

        if (isAdded) {
            const { isPrivate } = await playlistService.checkPlaylistPrivate(playlistId)

            if (isPrivate) {
                throw new GraphQLError(constants.MESSAGES.PRIVATE_PLAYLIST, {
                    extensions: {
                        code: 'FORBIDDEN'
                    }
                })
            }
        }

        isAdded ? await addPlaylist(sub, playlistId) : await removePlaylist(sub, playlistId)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface addRemoveLibraryPlaylist {
    playlistId: string
    isAdded: boolean
}

const addLibraryArtist = async (token: string, artistId: string): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await userService.getArtistById(artistId)) {
            throw new GraphQLError(constants.MESSAGES.ARTIST_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            $and: [
                { userId: new mongoose.Types.ObjectId(sub) },
                { artists: { $ne: new mongoose.Types.ObjectId(artistId) } }
            ]
        }

        const data = {
            $push: {
                artists: new mongoose.Types.ObjectId(artistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removeLibraryArtist = async (token: string, artistId: string): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await userService.getArtistById(artistId)) {
            throw new GraphQLError(constants.MESSAGES.ARTIST_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            $and: [
                { userId: new mongoose.Types.ObjectId(sub) },
                { artists: new mongoose.Types.ObjectId(artistId) }
            ]
        }

        const data = {
            $pull: {
                artists: new mongoose.Types.ObjectId(artistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const addLibraryAlbum = async (token: string, albumId: string): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await albumService.getAlbumById(albumId)) {
            throw new GraphQLError(constants.MESSAGES.ALBUM_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            $and: [
                { userId: new mongoose.Types.ObjectId(sub) },
                { albums: { $ne: new mongoose.Types.ObjectId(albumId) } }
            ]
        }

        const data = {
            $push: {
                albums: new mongoose.Types.ObjectId(albumId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removeLibraryAlbum = async (token: string, albumId: string): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await albumService.getAlbumById(albumId)) {
            throw new GraphQLError(constants.MESSAGES.ALBUM_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const query = {
            $and: [
                { userId: new mongoose.Types.ObjectId(sub) },
                { albums: new mongoose.Types.ObjectId(albumId) }
            ]
        }

        const data = {
            $pull: {
                albums: new mongoose.Types.ObjectId(albumId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.LIBRARY, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const deleteLibraryByUserId = async (userId: string): Promise<void> => {
    try {
        const query = {
            userId: new mongoose.Types.ObjectId(userId)
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.LIBRARY, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getUserLibraryPlaylists = async ({ userId, page, limit }: userIdPageAndLimit): Promise<playlist[]> => {
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
                $lookup: {
                    from: 'playlists',
                    localField: 'playlists',
                    foreignField: '_id',
                    as: 'playlists'
                }
            },
            {
                $unwind: {
                    path: '$playlists'
                }
            },
            {
                $skip: ((page - 1) * limit)
            },
            {
                $limit: limit
            },
            {
                $group: {
                    _id: '$playlists._id',
                    name: { $first: '$playlists.name' },
                    image: { $first: '$playlists.image' },
                    description: { $first: '$playlists.description' },
                    isPrivate: { $first: '$playlists.isPrivate' },
                }
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

        return DbRepo.aggregate(constants.COLLECTIONS.LIBRARY, pipeline)
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

const getUserLibraryArtists = async ({ userId, page, limit }: userIdPageAndLimit): Promise<artist[]> => {
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
                $lookup: {
                    from: 'users',
                    localField: 'artists',
                    foreignField: '_id',
                    as: 'artists'
                }
            },
            {
                $unwind: {
                    path: '$artists'
                }
            },
            {
                $skip: ((page - 1) * limit)
            },
            {
                $limit: limit
            },
            {
                $group: {
                    _id: '$artists._id',
                    username: { $first: '$artists.username' },
                    name: { $first: '$artists.name' },
                    gender: { $first: '$artists.gender' },
                    dateOfBirth: { $first: '$artists.dateOfBirth' },
                    state: { $first: '$artists.state' },
                    country: { $first: '$artists.country' },
                    profile_picture: { $first: '$artists.profile_picture' },
                    description: { $first: '$artists.description' },
                    isVerified: { $first: '$artists.isVerified' }
                }
            },
            {
                $project: {
                    username: 1,
                    name: 1,
                    email: 1,
                    gender: 1,
                    dateOfBirth: 1,
                    state: 1,
                    country: 1,
                    profile_picture: 1,
                    description: 1,
                    isVerified: 1,
                    _id: 0,
                    artistId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.LIBRARY, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface artist {
    artistId: string
    username: string
    name: string
    email: string
    gender: string
    dateOfBirth: string
    state: string
    country: string
    profile_picture: string
    description: string
    isVerified: boolean
}

const getUserLibraryAlbums = async ({ userId, page, limit }: userIdPageAndLimit): Promise<album[]> => {
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
                $lookup: {
                    from: 'albums',
                    localField: 'albums',
                    foreignField: '_id',
                    as: 'albums'
                }
            },
            {
                $unwind: {
                    path: '$albums'
                }
            },
            {
                $skip: ((page - 1) * limit)
            },
            {
                $limit: limit
            },
            {
                $group: {
                    _id: '$albums._id',
                    name: { $first: '$albums.name' },
                    image: { $first: '$albums.image' },
                }
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    _id: 0,
                    albumId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.LIBRARY, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface album {
    albumId: string
    name: string
    image: string
}

export default {
    addPlaylist,
    removeAllPlaylists,
    removeAllAlbums,
    addRemoveLibraryPlaylist,
    addLibraryArtist,
    removeLibraryArtist,
    addLibraryAlbum,
    removeLibraryAlbum,
    deleteLibraryByUserId,
    getUserLibraryPlaylists,
    getUserLibraryArtists,
    getUserLibraryAlbums
}
