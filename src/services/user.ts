import { GraphQLError } from 'graphql'
import DbRepo from '../dbRepo'
import constants from '../constants'
import authService from './auth'

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
    _id: string,
    username: string,
    email: string
}

interface selectUserData {
    _id: number,
    username: number,
    name: number,
    email: number,
    password: number,
    gender: number,
    dateOfBirth: number,
    role: number,
    secret: number,
    state: number,
    country: boolean,
    profile_picture: number,
    description: number
    isVerified: number
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
    username: string,
    name?: string,
    email: string,
    password: string,
    gender?: genderType,
    dateOfBirth?: string,
    role?: roleType,
    secret?: string,
    state?: string,
    country?: string,
    profile_picture?: string,
    description?: string
}

interface getUserData {
    _id: string,
    username: string,
    name?: string,
    email: string,
    password: string,
    gender?: genderType,
    dateOfBirth?: string,
    role?: roleType,
    secret?: string,
    state?: string,
    country?: string,
    profile_picture?: string,
    description?: string,
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
    userId: string,
    device: string,
    token: string
}

const addUserSession = async (userId: string, sessionDate: Date): Promise<void> => {
    try {
        const query = {
            _id: userId
        }

        const data = {
            $push: {
                session_logins: {
                    $each: [sessionDate],
                    $position: 0
                }
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

const getSessionByDevice = async (deviceToken: string): Promise<object | null> => {
    try {
        const query = {
            device: deviceToken
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

const updateUserById = async (userId: string, userData: Partial<userData>): Promise<void> => {
    try {
        const query = {
            _id: userId
        }

        if (userData.username || userData.email) {
            if (await authService.checkUserAlreadyExist(userData.username || '', userData.email || '')) {
                throw new GraphQLError(constants.MESSAGES.USER_ALREADY_EXISTS, {
                    extensions: {
                        code: 'FORBIDDEN'
                    }
                })
            }
        }

        userData.role = userData.role === 'admin' ? authService.validateUserRole(roleType.ADMIN, userData.secret || '')
            : userData.role === 'artist' ? authService.validateUserRole(roleType.ARTIST, userData.secret || '')
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

const deleteAllSessions = async (userId: string): Promise<void> => {
    try {
        const query = {
            userId
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

export default {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    getFullUser,
    createUser,
    createSession,
    addUserSession,
    getSessionByDevice,
    updateUserById,
    deleteAllSessions,
    validateSession,
    getSessionById,
    updateSessionById,
    deleteSessionById
}
