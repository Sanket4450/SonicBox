import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'

const getAlbumById = async (_id: string): Promise<{ _id: string } | null> => {
    const query = {
        _id
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.ALBUM, { query, data })
}

const getAlbumByIdAndArtist = async (albumId: string, artistId: string): Promise<{ _id: string } | null> => {
    const query = {
        _id: albumId,
        artistId
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.ALBUM, { query, data })
}

const getAlbumByNameAndArtist = async (name: string, artistId: string): Promise<{ _id: string } | null> => {
    const query = {
        name: { $regex: name, $options: 'i' },
        artistId
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.ALBUM, { query, data })
}

const createAlbum = async (token: string, input: albumInput): Promise<albumData> => {
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
            throw new GraphQLError(constants.MESSAGES.CANNOT_POST_ALBUM, {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
        }

        if (await getAlbumByNameAndArtist(input.name, sub)) {
            throw new GraphQLError(constants.MESSAGES.ALBUM_ALREADY_EXISTS, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        const data = {
            ...input,
            artistId: new mongoose.Types.ObjectId(sub)
        }

        return DbRepo.create(constants.COLLECTIONS.ALBUM, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface albumInput {
    name: string
    image: string
}

interface albumData {
    _id: string
    name: string
    artistId: string
    image: string
}

const updateAlbum = async (token: string, { albumId, input }: updateAlbumParams): Promise<albumData> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await userService.getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getAlbumById(albumId)) {
            throw new GraphQLError(constants.MESSAGES.ALBUM_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getAlbumByIdAndArtist(albumId, sub)) {
            throw new GraphQLError(constants.MESSAGES.CANNOT_MODIFY_RESOURCE, {
                extensions: {
                    code: 'UNAUTHORIZED'
                }
            })
        }

        if (input.artistId && !await userService.getArtistById(input.artistId)) {
            throw new GraphQLError(constants.MESSAGES.ARTIST_NOT_EXIST, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        const query = {
            _id: albumId
        }

        const data = {
            ...input
        }

        return DbRepo.updateOne(constants.COLLECTIONS.ALBUM, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface updateAlbumParams {
    albumId: string
    input: {
        artistId?: string
        name?: string
        image?: string
    }
}

export default {
    getAlbumByIdAndArtist,
    createAlbum,
    updateAlbum
}