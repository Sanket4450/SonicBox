import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import userService from './user'
import tokenService from './token'
import songService from './song'
import libraryService from './library'

const getAlbumById = async (_id: string): Promise<{ _id: string } | null> => {
    const query = {
        _id: new mongoose.Types.ObjectId(_id)
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.ALBUM, { query, data })
}

const getAlbumByIdAndArtist = async (albumId: string, artistId: string): Promise<{ _id: string } | null> => {
    const query = {
        _id: new mongoose.Types.ObjectId(albumId),
        artistId: new mongoose.Types.ObjectId(artistId)
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.ALBUM, { query, data })
}

const getAlbumByNameAndArtist = async (name: string, artistId: string): Promise<{ _id: string } | null> => {
    const query = {
        name: { $regex: name, $options: 'i' },
        artistId: new mongoose.Types.ObjectId(artistId)
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.ALBUM, { query, data })
}

const getFullAlbumById = async (_id: string): Promise<updateAlbumData> => {
    const query = {
        _id: new mongoose.Types.ObjectId(_id)
    }

    const data = {}

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

const updateAlbum = async (token: string, { albumId, input }: updateAlbumParams): Promise<updateAlbumData> => {
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

        const query = {
            _id: new mongoose.Types.ObjectId(albumId)
        }

        const data = {
            $set: {
                ...input
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.ALBUM, { query, data })

        return getFullAlbumById(albumId)
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
        name?: string
        image?: string
    }
}

interface updateAlbumData {
    _id: string,
    name: string,
    artistId: string,
    image: string
}

const deleteAlbum = async (token: string, albumId: string): Promise<void> => {
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

        if (await songService.getSongByAlbum(albumId)) {
            throw new GraphQLError(constants.MESSAGES.ALBUM_MUST_BE_EMPTY, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        const query = {
            _id: new mongoose.Types.ObjectId(albumId)
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.ALBUM, { query })

        await libraryService.removeAllAlbums(albumId)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getAlbums = async (input: albumsInput = {}): Promise<album[]> => {
    try {
        const keyword: string = input.keyword || ''
        const page: number = input.page || 1
        const limit: number = input.limit || 10

        const pipeline: object[] = [
            {
                $match: {
                    name: { $regex: keyword, $options: 'i' }
                }
            },
            {
                $skip: ((page - 1) * limit)
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'artistId',
                    foreignField: '_id',
                    as: 'artist'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    image: { $first: '$image' },
                    artist: {
                        $addToSet: {
                            artistId: { $first: '$artist._id' },
                            username: { $first: '$artist.username' },
                            name: { $first: '$artist.name' },
                            gender: { $first: '$artist.ge' },
                            dateOfBirth: { $first: '$artist.dateOfBirth' },
                            state: { $first: '$artist.state' },
                            country: { $first: '$artist.country' },
                            profile_picture: { $first: '$artist.profile_picture' },
                            description: { $first: '$artist.description' },
                            isVerified: { $first: '$artist.isVerified' },
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: '$artist'
                }
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    'artist.artistId': 1,
                    'artist.username': 1,
                    'artist.name': 1,
                    'artist.gender': 1,
                    'artist.dateOfBirth': 1,
                    'artist.state': 1,
                    'artist.country': 1,
                    'artist.profile_picture': 1,
                    'artist.description': 1,
                    'artist.isVerified': 1,
                    _id: 0,
                    albumId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.ALBUM, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface albumsInput {
    keyword?: string
    page?: number
    limit?: number
}

interface album {
    albumId: string
    name: string
    image: string
    artist: artist
}

interface artist {
    artistId: string
    username: string
    name: string
    gender: string
    dateOfBirth: string
    state: string
    country: string
    profile_picture: string
    description: string
    isVerified: boolean
}

const getSingleAlbum = async (albumId: string): Promise<singleAlbum[]> => {
    try {
        const pipeline: object[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(albumId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'artistId',
                    foreignField: '_id',
                    as: 'artist'
                }
            },
            {
                $lookup: {
                    from: 'songs',
                    localField: '_id',
                    foreignField: 'albumId',
                    as: 'songs'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    image: { $first: '$image' },
                    artist: {
                        $addToSet: {
                            artistId: { $first: '$artist._id' },
                            username: { $first: '$artist.username' },
                            name: { $first: '$artist.name' },
                            gender: { $first: '$artist.ge' },
                            dateOfBirth: { $first: '$artist.dateOfBirth' },
                            state: { $first: '$artist.state' },
                            country: { $first: '$artist.country' },
                            profile_picture: { $first: '$artist.profile_picture' },
                            description: { $first: '$artist.description' },
                            isVerified: { $first: '$artist.isVerified' },
                        }
                    },
                    songs: { $first: '$songs' }
                }
            },
            {
                $unwind: {
                    path: '$artist'
                }
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    'artist.artistId': 1,
                    'artist.username': 1,
                    'artist.name': 1,
                    'artist.gender': 1,
                    'artist.dateOfBirth': 1,
                    'artist.state': 1,
                    'artist.country': 1,
                    'artist.profile_picture': 1,
                    'artist.description': 1,
                    'artist.isVerified': 1,
                    _id: 0,
                    albumId: '$_id',
                    songs: {
                        $map: {
                            input: '$songs',
                            as: 'song',
                            in: {
                                songId: '$$song._id',
                                name: '$$song.name',
                                fileURL: '$$song.fileURL',
                            }
                        }
                    }
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.ALBUM, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface singleAlbum {
    albumId: string
    name: string
    image: string
    artist: artist
    songs: song[]
}

interface song {
    songId: string
    name: string
    fileURL: string
}

export default {
    getAlbumById,
    getAlbumByIdAndArtist,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbums,
    getSingleAlbum
}
