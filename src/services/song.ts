import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import albumService from './album'
import playlistService from './playlist'

const getSongById = async (_id: string): Promise<{ _id: string } | null> => {
    const query = {
        _id
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.SONG, { query, data })
}

const getSongByIdAndArtist = async (_id: string, artistId: string): Promise<{ _id: string } | null> => {
    const query = {
        _id,
        artists: artistId
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.SONG, { query, data })
}

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

const getFullSongById = async (_id: string): Promise<updateSongData> => {
    const query = {
        _id
    }

    const data = {}

    return DbRepo.findOne(constants.COLLECTIONS.SONG, { query, data })
}

const getSongByAlbum = async (albumId: string): Promise<{ _id: 1 } | null > => {
    const query = {
        albumId
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.SONG, { query, data })
}

const createSong = async (token: string, input: songInput): Promise<songData> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!input.artists.includes(sub)) {
            throw new GraphQLError(constants.MESSAGES.ARTIST_MUST_INCLUDED, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        for (let artistId of input.artists) {
            if (!await userService.getArtistById(artistId)) {
                throw new GraphQLError(constants.MESSAGES.ONE_ARTIST_NOT_EXIST, {
                    extensions: {
                        code: 'CONFLICT'
                    }
                })
            }
        }

        if (!await albumService.getAlbumByIdAndArtist(input.albumId, sub)) {
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
    artists: string[]
}

interface songData {
    _id: string
    name: string
    fileURL: string
    albumId: string
    artists: string[]
}

const addArtist = async (songId: string, artistId: string): Promise<void> => {
    try {
        const query = {
            $and: [
                { _id: songId },
                { artists: { $ne: new mongoose.Types.ObjectId(artistId) } }
            ]
        }

        const data = {
            $push: {
                artists: new mongoose.Types.ObjectId(artistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.SONG, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const removeArtist = async (songId: string, artistId: string, defaultArtist: string): Promise<void> => {
    try {
        const query = {
            $and: [
                { _id: songId },
                { artists: new mongoose.Types.ObjectId(artistId) },
                { artists: { $ne: new mongoose.Types.ObjectId(defaultArtist) } }
            ]
        }

        const data = {
            $pull: {
                artists: new mongoose.Types.ObjectId(artistId)
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.SONG, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const updateSong = async (token: string, { songId, input }: updateSongParams): Promise<updateSongData> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getSongById(songId)) {
            throw new GraphQLError(constants.MESSAGES.SONG_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getSongByIdAndArtist(songId, sub)) {
            throw new GraphQLError(constants.MESSAGES.SONG_NOT_EXIST, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        if (input.addArtist) {
            if (!await userService.getArtistById(input.addArtist)) {
                throw new GraphQLError(constants.MESSAGES.ARTIST_NOT_EXIST, {
                    extensions: {
                        code: 'CONFLICT'
                    }
                })
            }
            else {
                await addArtist(songId, input.addArtist)
            }
        }

        if (input.removeArtist) {
            if (!await userService.getArtistById(input.removeArtist)) {
                throw new GraphQLError(constants.MESSAGES.ARTIST_NOT_EXIST, {
                    extensions: {
                        code: 'CONFLICT'
                    }
                })
            }
            else {
                await removeArtist(songId, input.removeArtist, sub)
            }
        }

        delete input.addArtist
        delete input.removeArtist

        const query = {
            _id: songId
        }

        const data = {
            $set: {
                ...input
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.SONG, { query, data })

        return getFullSongById(songId)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface updateSongParams {
    songId: string
    input: {
        name?: string
        fileURL?: string
        addArtist?: string
        removeArtist?: string
    }
}

interface updateSongData {
    _id: string
    name: string
    albumId: string
    fileURL: string
    listens: number
    artists: string[]
}

const deleteSong = async (token: string, songId: string): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getSongById(songId)) {
            throw new GraphQLError(constants.MESSAGES.SONG_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getSongByIdAndArtist(songId, sub)) {
            throw new GraphQLError(constants.MESSAGES.CANNOT_MODIFY_RESOURCE, {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
        }

        const query = {
            _id: songId
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.SONG, { query })

        await playlistService.removeAllSongs(songId)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

export default {
    getSongById,
    getSongByAlbum,
    createSong,
    updateSong,
    deleteSong
}
