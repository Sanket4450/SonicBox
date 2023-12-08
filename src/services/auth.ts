import { GraphQLError } from 'graphql'
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
    if (role === roleType.admin && secret === process.env.ADMIN_SECRET) return roleType.admin
    if (role === roleType.artist && secret === process.env.ARTIST_SECRET) return roleType.artist
    if (role === roleType.user) return roleType.user
    throw new GraphQLError(constants.MESSAGES.USER_NOT_AUTHORIZED, {
        extensions: {
            code: 'UNAUTHORIZED'
        }
    })
}

const registerUser = async (userData: userData): Promise<getUserData> => {
    if (await checkUserAlreadyExist(userData.username, userData.email)) {
        throw new GraphQLError(constants.MESSAGES.USER_ALREADY_EXISTS, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    userData.role = userData.role === roleType.admin || userData.role === roleType.artist
        ? validateUserRole(userData.role, userData.secret || '')
        : roleType.user

    userData.password = await bcrypt.hash(userData.password, 10)

    return await userService.createUser(userData)
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
    id?: string,
    _id?: string,
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
    isVerified?: boolean,
    token: string | null
}

enum genderType {
    male = 'male',
    female = 'female',
    other = 'other'
}

enum roleType {
    user = 'user',
    artist = 'artist',
    admin = 'admin'
}

export default {
    registerUser,
    checkUserAlreadyExist,
    validateUserRole
}
