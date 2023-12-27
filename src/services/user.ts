import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import DbRepo from '../dbRepo'
import constants from '../constants'
import authService from './auth'
import tokenService from './token'
import playlistService from './playlist'
import libraryService from './library'

const getUserById = async (_id: string): Promise<{ _id: string } | null> => {
    const query = {
        _id
    }

    const data = {
        _id: 1,
    }

    return DbRepo.findOne(constants.COLLECTIONS.USER, { query, data })
}

const getUserByUsername = async (username: string): Promise<Pick<getUserData, '_id' | 'role' | 'password'>> => {
    const query = {
        username
    }

    const data = {
        _id: 1,
        role: 1,
        password: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.USER, { query, data })
}

const getUserByEmail = async (email: string): Promise<Pick<getUserData, '_id' | 'role' | 'password'>> => {
    const query = {
        email
    }

    const data = {
        _id: 1,
        role: 1,
        password: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.USER, { query, data })
}

const getArtistById = async (_id: string): Promise<{ _id: string } | null> => {
    const query = {
        _id,
        role: 'artist'
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.USER, { query, data })
}

const getFullUser = async (userQuery: Partial<idUsernameEmail>, userData: Partial<selectUserData>): Promise<Partial<getUserData>> => {
    const query = {
        ...userQuery
    }

    const data = {
        ...userData
    }

    return DbRepo.findOne(constants.COLLECTIONS.USER, { query, data })
}

interface idUsernameEmail {
    _id: string
    username: string
    email: string
}

interface selectUserData {
    _id: number
    username: number
    name: number
    email: number
    password: number
    gender: number
    dateOfBirth: number
    role: number
    secret: number
    state: number
    country: number
    profile_picture: number
    description: number
    isVerified: number
}

const createLibrary = async (userId: string): Promise<void> => {
    try {
        const data = {
            userId
        }

        return DbRepo.create(constants.COLLECTIONS.LIBRARY, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const createUser = async (userData: userData): Promise<getUserData> => {
    try {
        const data = {
            ...userData
        }

        return DbRepo.create(constants.COLLECTIONS.USER, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface userData {
    username: string
    name?: string
    email: string
    password: string
    gender?: genderType
    dateOfBirth?: string
    role?: roleType
    secret?: string
    state?: string
    country?: string
    profile_picture?: string
    description?: string
}

interface getUserData {
    _id: string
    username: string
    name?: string
    email: string
    password: string
    gender?: genderType
    dateOfBirth?: string
    role?: roleType
    secret?: string
    state?: string
    country?: string
    profile_picture?: string
    description?: string
    isVerified?: boolean
}

enum genderType {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

enum roleType {
    USER = 'user',
    ARTIST = 'artist',
    ADMIN = 'admin'
}

const createSession = async (sessionData: sessionData): Promise<any> => {
    try {
        const data = {
            ...sessionData
        }

        return DbRepo.create(constants.COLLECTIONS.SESSION, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface sessionData {
    userId: string
    device: string
    token: string
}

const getSessionByuserIdAndDevice = async (userId: string, device: string): Promise<{ _id: string }> => {
    try {
        const query = {
            userId,
            device
        }

        const data = {
            _id: 1
        }

        return DbRepo.findOne(constants.COLLECTIONS.SESSION, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const updateUserById = async (_id: string, userData: Partial<userData>): Promise<void> => {
    try {
        const query = {
            _id
        }

        if (userData.username || userData.email) {
            if (await authService.checkUserAlreadyExist(userData.username as string, userData.email as string)) {
                throw new GraphQLError(constants.MESSAGES.USER_ALREADY_EXISTS, {
                    extensions: {
                        code: 'FORBIDDEN'
                    }
                })
            }
        }

        userData.role = userData.role && userData.role === 'admin' ? authService.validateUserRole(roleType.ADMIN, userData.secret as string)
            : userData.role && userData.role === 'artist' ? authService.validateUserRole(roleType.ARTIST, userData.secret as string)
            : roleType.USER

        const data = {
            $set: {
                ...userData
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.USER, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const updateUser = async (token: string, userData: Partial<userData>): Promise<updateUserData> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        await updateUserById(sub, userData)

        const userSelection = {
            _id: 1,
            username: 1,
            name: 1,
            email: 1,
            gender: 1,
            dateOfBirth: 1,
            state: 1,
            country: 1,
            profile_picture: 1,
            description: 1,
            isVerified: 1
        }

        return getFullUser({ _id: sub }, { ...userSelection }) as unknown as updateUserData
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface updateUserData {
    _id: string
    username: string
    name: string
    email: string
    gender: genderType
    dateOfBirth: string
    state: string
    country: string
    profile_picture: string
    description: string
    isVerified: boolean
}

const deleteAllSessions = async (userId: string): Promise<void> => {
    try {
        const query = {
            userId: new mongoose.Types.ObjectId(userId)
        }

        await DbRepo.deleteMany(constants.COLLECTIONS.SESSION, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const validateSession = async ({ userId, device, token }: sessionData): Promise<{ sessionId: string }> => {
    try {
        const query = {
            userId,
            token
        }

        const data = {
            _id: 1
        }

        if (!await DbRepo.findOne(constants.COLLECTIONS.SESSION, { query, data })) {
            throw new GraphQLError(constants.MESSAGES.INVALID_TOKEN, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        Object.assign(query, { device })

        const session = await DbRepo.findOne(constants.COLLECTIONS.SESSION, { query, data })

        if (!session) {
            throw new GraphQLError(constants.MESSAGES.SESSION_EXPIRED, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        return { sessionId: session._id }
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getSessionById = async (_id: string): Promise<{ _id: string }> => {
    try {
        const query = {
            _id
        }

        const data = {
            _id: 1
        }

        return DbRepo.findOne(constants.COLLECTIONS.SESSION, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const updateSessionById = async (_id: string, token: string): Promise<void> => {
    try {
        const query = {
            _id
        }

        const data = {
            $set: {
                token
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.SESSION, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const deleteSessionById = async (_id: string): Promise<void> => {
    try {
        const query = {
            _id
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.SESSION, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getUserAndFollower = async (followingId: string, followerId: string): Promise<{ _id: 1 } | null> => {
    try {
        const query = {
            userId: new mongoose.Types.ObjectId(followingId),
            followerId: new mongoose.Types.ObjectId(followerId)
        }

        const data = {
            _id: 1
        }

        return DbRepo.findOne(constants.COLLECTIONS.FOLLOWER, { query, data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const followUserById = async (followingId: string, followerId: string): Promise<void> => {
    try {
        const data = {
            userId: new mongoose.Types.ObjectId(followingId),
            followerId: new mongoose.Types.ObjectId(followerId)
        }

        await DbRepo.create(constants.COLLECTIONS.FOLLOWER, { data })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const followUser = async (token: string, { userId }: followUnfollowUser): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getUserById(userId)) {
            throw new GraphQLError(constants.MESSAGES.FOLLOWING_USER_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (sub === userId) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_ALLOWED, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        if (!await getUserAndFollower(userId, sub)) {
            await followUserById(userId, sub)
        }
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const unfollowUserById = async (followingId: string, followerId: string): Promise<void> => {
    try {
        const query = {
            userId: new mongoose.Types.ObjectId(followingId),
            followerId: new mongoose.Types.ObjectId(followerId)
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.FOLLOWER, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const unfollowUser = async (token: string, { userId }: followUnfollowUser): Promise<void> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (!await getUserById(userId)) {
            throw new GraphQLError(constants.MESSAGES.FOLLOWING_USER_NOT_EXIST, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (sub === userId) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_ALLOWED, {
                extensions: {
                    code: 'CONFLICT'
                }
            })
        }

        if (await getUserAndFollower(userId, sub)) {
            await unfollowUserById(userId, sub)
        }
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface followUnfollowUser {
    userId: string
}

const deleteAllFollowersAndFollowings = async (_id: string): Promise<void> => {
    try {
        const query = {
            $or: [
                { userId: new mongoose.Types.ObjectId(_id) },
                { followerId: new mongoose.Types.ObjectId(_id) }
            ]
        }

        await DbRepo.deleteMany(constants.COLLECTIONS.FOLLOWER, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const deleteUserById = async (_id: string): Promise<void> => {
    try {
        const query = {
            _id: new mongoose.Types.ObjectId(_id)
        }

        await DbRepo.deleteOne(constants.COLLECTIONS.USER, { query })
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const deleteUser = async (token: string): Promise<void> => {
    try {
        const { sub, role } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        if (role === 'artist') {
            throw new GraphQLError(constants.MESSAGES.ARTIST_NOT_DELETE, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        if (role === 'admin') {
            throw new GraphQLError(constants.MESSAGES.ADMIN_NOT_DELETE, {
                extensions: {
                    code: 'FORBIDDEN'
                }
            })
        }

        await deleteAllSessions(sub)

        await deleteUserById(sub)

        await deleteAllFollowersAndFollowings(sub)

        await libraryService.deleteLibraryByUserId(sub)

        await playlistService.deleteAllPlaylistsByUserId(sub)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getUsers = async (input: usersInput = {}): Promise<user[]> => {
    try {
        const keyword: string = input.keyword || ''
        const page: number = input.page || 1
        const limit: number = input.limit || 10

        const pipeline: object[] = [
            {
                $match: {
                    $or: [
                        { username: { $regex: keyword, $options: 'i' } },
                        { name: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                        { state: { $regex: keyword, $options: 'i' } },
                        { country: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } }
                    ]
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
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'followers'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followerId',
                    as: 'followings'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    gender: { $first: '$gender' },
                    dateOfBirth: { $first: '$dateOfBirth' },
                    state: { $first: '$state' },
                    country: { $first: '$country' },
                    profile_picture: { $first: '$profile_picture' },
                    description: { $first: '$description' },
                    isVerified: { $first: '$isVerified' },
                    followersCount: { $sum: { $size: '$followers' } },
                    followingsCount: { $sum: { $size: '$followings' } },
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
                    followersCount: 1,
                    followingsCount: 1,
                    _id: 0,
                    userId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.USER, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface usersInput {
    keyword?: string
    page?: number
    limit?: number
}

interface user {
    userId: string
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
    followingsCount: number
    followersCount: number
}

const getSingleUser = async (userId: string): Promise<user[]> => {
    try {
        const pipeline: object[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'followers'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followerId',
                    as: 'followings'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    gender: { $first: '$gender' },
                    dateOfBirth: { $first: '$dateOfBirth' },
                    state: { $first: '$state' },
                    country: { $first: '$country' },
                    profile_picture: { $first: '$profile_picture' },
                    description: { $first: '$description' },
                    isVerified: { $first: '$isVerified' },
                    followersCount: { $sum: { $size: '$followers' } },
                    followingsCount: { $sum: { $size: '$followings' } },
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
                    followersCount: 1,
                    followingsCount: 1,
                    _id: 0,
                    userId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.USER, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getUserFollowers = async ({ userId, page, limit }: userIdPageAndLimit): Promise<user[]> => {
    try {
        page ||= 1
        limit ||= 10

        const pipeline: object[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'followers'
                }
            },
            {
                $unwind: {
                    path: '$followers'
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
                    localField: 'followers.followerId',
                    foreignField: '_id',
                    as: 'followers'
                }
            },
            {
                $unwind: {
                    path: '$followers'
                }
            },
            {
                $group: {
                    _id: '$followers._id',
                    username: { $first: '$followers.username' },
                    name: { $first: '$followers.name' },
                    email: { $first: '$followers.email' },
                    gender: { $first: '$followers.gender' },
                    dateOfBirth: { $first: '$followers.dateOfBirth' },
                    state: { $first: '$followers.state' },
                    country: { $first: '$followers.country' },
                    profile_picture: { $first: '$followers.profile_picture' },
                    description: { $first: '$followers.description' },
                    isVerified: { $first: '$followers.isVerified' }
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
                    userId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.USER, pipeline)
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

const getUserFollowings = async ({ userId, page, limit }: userIdPageAndLimit): Promise<user[]> => {
    try {
        page ||= 1
        limit ||= 10

        const pipeline: object[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followerId',
                    as: 'followings'
                }
            },
            {
                $unwind: {
                    path: '$followings'
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
                    localField: 'followings.userId',
                    foreignField: '_id',
                    as: 'followings'
                }
            },
            {
                $unwind: {
                    path: '$followings'
                }
            },
            {
                $group: {
                    _id: '$followings._id',
                    username: { $first: '$followings.username' },
                    name: { $first: '$followings.name' },
                    email: { $first: '$followings.email' },
                    gender: { $first: '$followings.gender' },
                    dateOfBirth: { $first: '$followings.dateOfBirth' },
                    state: { $first: '$followings.state' },
                    country: { $first: '$followings.country' },
                    profile_picture: { $first: '$followings.profile_picture' },
                    description: { $first: '$followings.description' },
                    isVerified: { $first: '$followings.isVerified' }
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
                    userId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.USER, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getProfile = async (token: string): Promise<user[]> => {
    try {
        const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

        if (!await getUserById(sub)) {
            throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
                extensions: {
                    code: 'NOT_FOUND'
                }
            })
        }

        const pipeline: object[] = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(sub)
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'followers'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followerId',
                    as: 'followings'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    gender: { $first: '$gender' },
                    dateOfBirth: { $first: '$dateOfBirth' },
                    state: { $first: '$state' },
                    country: { $first: '$country' },
                    profile_picture: { $first: '$profile_picture' },
                    description: { $first: '$description' },
                    isVerified: { $first: '$isVerified' },
                    followersCount: { $sum: { $size: '$followers' } },
                    followingsCount: { $sum: { $size: '$followings' } },
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
                    followersCount: 1,
                    followingsCount: 1,
                    _id: 0,
                    userId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.USER, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const getArtists = async (input: artistsInput = {}): Promise<artist[]> => {
    try {
        const keyword: string = input.keyword || ''
        const page: number = input.page || 1
        const limit: number = input.limit || 10

        const pipeline: object[] = [
            {
                $match: {
                    role: 'artist',
                    $or: [
                        { username: { $regex: keyword, $options: 'i' } },
                        { name: { $regex: keyword, $options: 'i' } },
                        { email: { $regex: keyword, $options: 'i' } },
                        { state: { $regex: keyword, $options: 'i' } },
                        { country: { $regex: keyword, $options: 'i' } },
                        { description: { $regex: keyword, $options: 'i' } }
                    ]
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
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'followers'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followerId',
                    as: 'followings'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    gender: { $first: '$gender' },
                    dateOfBirth: { $first: '$dateOfBirth' },
                    state: { $first: '$state' },
                    country: { $first: '$country' },
                    profile_picture: { $first: '$profile_picture' },
                    description: { $first: '$description' },
                    isVerified: { $first: '$isVerified' },
                    followersCount: { $sum: { $size: '$followers' } },
                    followingsCount: { $sum: { $size: '$followings' } },
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
                    followersCount: 1,
                    followingsCount: 1,
                    _id: 0,
                    artistId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.USER, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface artistsInput {
    keyword?: string
    page?: number
    limit?: number
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
    followingsCount: number
    followersCount: number
}

const getSingleArtist = async (artistId: string): Promise<artist[]> => {
    try {
        const pipeline: object[] = [
            {
                $match: {
                    role: 'artist',
                    _id: new mongoose.Types.ObjectId(artistId)
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'followers'
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followerId',
                    as: 'followings'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    name: { $first: '$name' },
                    gender: { $first: '$gender' },
                    dateOfBirth: { $first: '$dateOfBirth' },
                    state: { $first: '$state' },
                    country: { $first: '$country' },
                    profile_picture: { $first: '$profile_picture' },
                    description: { $first: '$description' },
                    isVerified: { $first: '$isVerified' },
                    followersCount: { $sum: { $size: '$followers' } },
                    followingsCount: { $sum: { $size: '$followings' } },
                }
            },
            {
                $project: {
                    username: 1,
                    name: 1,
                    gender: 1,
                    dateOfBirth: 1,
                    state: 1,
                    country: 1,
                    profile_picture: 1,
                    description: 1,
                    isVerified: 1,
                    followersCount: 1,
                    followingsCount: 1,
                    _id: 0,
                    artistId: '$_id'
                }
            }
        ]

        return DbRepo.aggregate(constants.COLLECTIONS.USER, pipeline)
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

export default {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getArtistById,
    getFullUser,
    createLibrary,
    createUser,
    createSession,
    getSessionByuserIdAndDevice,
    updateUserById,
    updateUser,
    deleteAllSessions,
    validateSession,
    getSessionById,
    updateSessionById,
    deleteSessionById,
    followUser,
    unfollowUser,
    deleteUser,
    getUsers,
    getSingleUser,
    getUserFollowings,
    getUserFollowers,
    getProfile,
    getArtists,
    getSingleArtist
}
