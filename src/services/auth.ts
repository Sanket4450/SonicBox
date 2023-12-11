import { GraphQLError, graphql } from 'graphql'
import bcrypt from 'bcryptjs'
import constants from '../constants'
import userService from './user'

const checkUserAlreadyExist = async (username: string, email: string): Promise<boolean> => {
    if (await userService.getUserByUsername(username) || await userService.getUserByEmail(email)) {
        return true
    }
    return false
}

const validateUserRole = (role: roleType, secret: string): roleType => {
    if (role === roleType.ADMIN && secret === process.env.ADMIN_SECRET) return roleType.ADMIN
    if (role === roleType.ARTIST && secret === process.env.ARTIST_SECRET) return roleType.ARTIST
    if (role === roleType.USER) return roleType.USER
    throw new GraphQLError(constants.MESSAGES.USER_NOT_AUTHORIZED, {
        extensions: {
            code: 'UNAUTHORIZED'
        }
    })
}

const registerUser = async (userData: userData): Promise<userIdAndRole> => {
    if (await checkUserAlreadyExist(userData.username, userData.email)) {
        throw new GraphQLError(constants.MESSAGES.USER_ALREADY_EXISTS, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    userData.role = userData.role === roleType.ADMIN || userData.role === roleType.ARTIST
        ? validateUserRole(userData.role, userData.secret || '')
        : roleType.USER

    userData.password = await bcrypt.hash(userData.password, 10)

    const { _id, role } = await userService.createUser(userData)

    return { _id, role }
}

const loginUser = async (loginData: loginData): Promise<userIdAndRole> => {
    if (!loginData.username && !loginData.email) {
        throw new GraphQLError(constants.MESSAGES.USERNAME_EMAIL_REQUIRED, {
            extensions: {
                code: 'BAD_USER_INPUT'
            }
        })
    }

    if (loginData.username && loginData.email) {
        throw new GraphQLError(constants.MESSAGES.ONE_OF_THEM_REQUIRED, {
            extensions: {
                code: 'BAD_USER_INPUT'
            }
        })
    }

    if (!await checkUserAlreadyExist(loginData.username || '', loginData.email || '')) {
        throw new GraphQLError(constants.MESSAGES.USER_NOT_EXIST, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    const { _id, role, password } = loginData.username
        ? await userService.getUserByUsername(loginData.username || '')
        : await userService.getUserByEmail(loginData.email || '')

    if (!await bcrypt.compare(loginData.password, password)) {
        throw new GraphQLError(constants.MESSAGES.INCORRECT_PASSWORD, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    return { _id, role }
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

interface userIdAndRole {
    _id: string,
    role: roleType | undefined
}

interface loginData {
    username?: string,
    email?: string,
    password: string
}

export default {
    registerUser,
    checkUserAlreadyExist,
    validateUserRole,
    loginUser
}
