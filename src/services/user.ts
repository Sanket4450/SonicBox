import { GraphQLError } from 'graphql'
import bcrypt from 'bcryptjs'
import DbRepo from '../dbRepo'
import constants from '../constants'
import authService from './auth'

const getUserByUsername = async (username: string): Promise<object | null> => {
    const query = {
        username
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.USER, { query, data })
}

const getUserByEmail = async (email: string): Promise<object | null> => {
    const query = {
        email
    }

    const data = {
        _id: 1
    }

    return DbRepo.findOne(constants.COLLECTIONS.USER, { query, data })
}

const createUser = async (userData: userData): Promise<getUserData> => {
    const data = {
        ...userData
    }

    return DbRepo.create(constants.COLLECTIONS.USER, { data })
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
    description?: string,
    token?: string | null
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

const updateUserById = async (userId: string, userData: Partial<userData>): Promise<getUserData> => {
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

    userData.role = userData.role === roleType.admin || userData.role === roleType.artist
        ? authService.validateUserRole(userData.role, userData.secret || '')
        : roleType.user

    const data = {
        ...userData
    }

    return DbRepo.updateOne(constants.COLLECTIONS.USER, { query, data })
}

export default {
    getUserByUsername,
    getUserByEmail,
    createUser,
    updateUserById
}
