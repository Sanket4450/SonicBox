import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import playlistService from './playlist'
import albumService from './album'

const addPlaylist = async (userId: string, playlistId: string): Promise<void> => {
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
}

const removeAllPlaylists = async (playlistId: string): Promise<void> => {
    const query = {
        playlists: new mongoose.Types.ObjectId(playlistId)
    }

    const data = {
        $pull: {
            playlists: new mongoose.Types.ObjectId(playlistId)
        }
    }

    await DbRepo.updateMany(constants.COLLECTIONS.LIBRARY, { query, data })
}

const removeAllAlbums = async (albumId: string): Promise<void> => {
    const query = {
        albums: new mongoose.Types.ObjectId(albumId)
    }

    const data = {
        $pull: {
            albums: new mongoose.Types.ObjectId(albumId)
        }
    }

    await DbRepo.updateMany(constants.COLLECTIONS.LIBRARY, { query, data })
}

const addLibraryPlaylist = async (token: string, playlistId: string): Promise<void> => {
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

        const { isPrivate } = await playlistService.checkPlaylistPrivate(playlistId)

        if (isPrivate) {
            throw new GraphQLError(constants.MESSAGES.PRIVATE_PLAYLIST, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        await addPlaylist(sub, playlistId)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removeLibraryPlaylist = async (token: string, playlistId: string): Promise<void> => {
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

        const query = {
            $and: [
                { userId: new mongoose.Types.ObjectId(sub) },
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

export default {
    addPlaylist,
    removeAllPlaylists,
    removeAllAlbums,
    addLibraryPlaylist,
    removeLibraryPlaylist,
    addLibraryArtist,
    removeLibraryArtist,
    addLibraryAlbum,
    removeLibraryAlbum
}
