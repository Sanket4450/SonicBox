import { GraphQLError } from 'graphql'
import DbRepo from '../dbRepo'
import constants from '../constants'
import authService from './auth'

const getUserById = async (_id: string): Promise<{_id: string}> => {
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

const createUser = async (userData: userData): Promise<getUserData> => {
    try {
        const data = {
            ...userData
        }

        return DbRepo.create(constants.COLLECTIONS.USER, { data })
    } catch (error) {
        throw new GraphQLError(constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
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
    } catch (error) {
        throw new GraphQLError(constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface sessionData {
    userId: string,
    device: string,
    token: string
}

const addUserSession = async (userId: string, sessionDate: Date): Promise<getUserData> => {
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

        return DbRepo.updateOne(constants.COLLECTIONS.USER, { query, data })
    } catch (error) {
        throw new GraphQLError(constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
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
    } catch (error) {
        throw new GraphQLError(constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const updateUserById = async (userId: string, userData: Partial<userData> ): Promise<void> => {
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

        userData.role = userData.role === roleType.ADMIN || userData.role === roleType.ARTIST
            ? authService.validateUserRole(userData.role, userData.secret || '')
            : roleType.USER

        const data = {
            $set: {
                ...userData
            }
        }

        await DbRepo.updateOne(constants.COLLECTIONS.USER, { query, data })
    } catch (error) {
        throw new GraphQLError(constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

const deleteAllSessions = async (userId: string): Promise<void> => {
    try {
        const query = {
            userId
        }

        DbRepo.deleteMany(constants.COLLECTIONS.SESSION, { query })
    } catch (error) {
        throw new GraphQLError(constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

export default {
    getUserById,
    getUserByUsername,
    getUserByEmail,
    createUser,
    createSession,
    addUserSession,
    getSessionByDevice,
    updateUserById,
    deleteAllSessions
}
