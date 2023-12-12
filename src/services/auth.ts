import { GraphQLError } from 'graphql'
import bcrypt from 'bcryptjs'
import constants from '../constants'
import userService from './user'
import tokenService from './token'

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

const registerUser = async (userData: userData): Promise<userIdAndTokens> => {
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

    const { accessToken, refreshToken } = await tokenService.generateAuthTokens(_id || '', role)

    const { createdAt } = await userService.createSession({ userId: _id, device: userData.deviceToken, token: refreshToken })

    await userService.addUserSession(_id, createdAt)

    return { _id, accessToken, refreshToken }
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
    deviceToken: string
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

interface userIdAndTokens {
    _id: string,
    accessToken: string,
    refreshToken: string
}

const loginUser = async (loginData: loginData): Promise<userIdAndTokens> => {
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

    if (await userService.getSessionByDevice(loginData.deviceToken)) {
        throw new GraphQLError(constants.MESSAGES.ALREADY_LOGGED_IN, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    const user = loginData.username
        ? await userService.getUserByUsername(loginData.username || '')
        : await userService.getUserByEmail(loginData.email || '')

    if (!await bcrypt.compare(loginData.password, user.password)) {
        throw new GraphQLError(constants.MESSAGES.INCORRECT_PASSWORD, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    const { accessToken, refreshToken } = await tokenService.generateAuthTokens(user._id || '', user.role)

    const { createdAt } = await userService.createSession({ userId: user._id, device: loginData.deviceToken, token: refreshToken })

    await userService.addUserSession(user._id, createdAt)

    return { _id: user._id, accessToken, refreshToken }
}

interface loginData {
    username?: string,
    email?: string,
    password: string,
    deviceToken: string
}

const requestReset = async (email: string): Promise<string> => {
    const user = await userService.getUserByEmail(email)

    if (!user) {
        throw new GraphQLError(constants.MESSAGES.USER_NOT_EXIST_WITH_EMAIL, {
            extensions: {
                code: 'NOT_FOUND'
            }
        })
    }

    const role = user.role === 'admin' ? roleType.ADMIN : user.role === 'artist' ? roleType.ARTIST : roleType.USER

    return tokenService.generateToken({
        payload: {
            sub: user._id,
            role
        },
        secret: process.env.RESET_TOKEN_SECRET || '',
        options: { expiresIn: process.env.RESET_TOKEN_EXPIRY || '' }
    })
}

const verifyResetOtp = async ({ otp, resetToken }: otpAndToken): Promise<void> => {
    const { sub } = await tokenService.verifyToken(resetToken, process.env.RESET_TOKEN_SECRET || '')

    if (!await userService.getUserById(sub)) {
        throw new GraphQLError(constants.MESSAGES.AUTHENTICATION_FAILED, {
            extensions: {
                code: 'UNAUTHENTICATED'
            }
        })
    }

    if (otp !== 1234) {
        throw new GraphQLError(constants.MESSAGES.INCORRECT_OTP, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }
}

interface otpAndToken {
    otp: number,
    resetToken: string
}

const resetForgotPassword = async ({ password, resetToken }: passwordAndToken): Promise<void> => {
    const { sub } = await tokenService.verifyToken(resetToken, process.env.RESET_TOKEN_SECRET || '')

    if (!await userService.getUserById(sub)) {
        throw new GraphQLError(constants.MESSAGES.AUTHENTICATION_FAILED, {
            extensions: {
                code: 'UNAUTHENTICATED'
            }
        })
    }

    password = await bcrypt.hash(password, 10)

    await userService.updateUserById(sub, { password })

    await userService.deleteAllSessions(sub)
}

interface passwordAndToken {
    password: string,
    resetToken: string
}

export default {
    registerUser,
    checkUserAlreadyExist,
    validateUserRole,
    loginUser,
    requestReset,
    verifyResetOtp,
    resetForgotPassword
}
