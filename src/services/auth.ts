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

    userData.role = userData.role === 'admin' ? validateUserRole(roleType.ADMIN, userData.secret as string)
        : userData.role === 'artist' ? validateUserRole(roleType.ARTIST, userData.secret as string)
        : roleType.USER

    userData.password = await bcrypt.hash(userData.password, 10)

    const user = await userService.createUser(userData)

    const payload = {
        sub: user._id,
        role: userData.role,
        device: userData.deviceToken
    }

    const { accessToken, refreshToken } = await tokenService.generateAuthTokens(payload)

    const { createdAt } = await userService.createSession({ userId: user._id, device: userData.deviceToken, token: refreshToken })

    await userService.addUserSession(user._id, createdAt)

    return { userId: user._id, accessToken, refreshToken }
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
    userId: string
    accessToken: string
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

    if (!await checkUserAlreadyExist(loginData.username as string, loginData.email as string)) {
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
        ? await userService.getUserByUsername(loginData.username as string)
        : await userService.getUserByEmail(loginData.email as string)

    if (!await bcrypt.compare(loginData.password, user.password)) {
        throw new GraphQLError(constants.MESSAGES.INCORRECT_PASSWORD, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    const role = user.role === 'admin' ? roleType.ADMIN : user.role === 'artist' ? roleType.ARTIST : roleType.USER

    const payload = {
        sub: user._id,
        role,
        device: loginData.deviceToken
    }

    const { accessToken, refreshToken } = await tokenService.generateAuthTokens(payload)

    const { createdAt } = await userService.createSession({ userId: user._id, device: loginData.deviceToken, token: refreshToken })

    await userService.addUserSession(user._id, createdAt)

    return { userId: user._id, accessToken, refreshToken }
}

interface loginData {
    username?: string,
    email?: string,
    password: string,
    deviceToken: string
}

const requestReset = async ({ email, deviceToken }: requestResetData): Promise<string> => {
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
            role,
            device: deviceToken
        },
        secret: process.env.RESET_TOKEN_SECRET as string,
        options: { expiresIn: process.env.RESET_TOKEN_EXPIRY as string }
    })
}

interface requestResetData {
    email: string,
    deviceToken: string
}

const verifyResetOtp = async ({ otp, resetToken }: otpAndToken): Promise<void> => {
    const { sub } = await tokenService.verifyToken(resetToken, process.env.RESET_TOKEN_SECRET as string)

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

const resetForgotPassword = async ({ password, resetToken }: passwordAndResetToken): Promise<void> => {
    const { sub } = await tokenService.verifyToken(resetToken, process.env.RESET_TOKEN_SECRET as string)

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

interface passwordAndResetToken {
    password: string,
    resetToken: string
}

const resetPassword = async (token: string, { oldPassword, newPassword }: oldNewPassword): Promise<void> => {
    const { sub } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)

    const user = await userService.getFullUser({ _id: sub }, { password: 1 })

    if (!user) {
        throw new GraphQLError(constants.MESSAGES.AUTHENTICATION_FAILED, {
            extensions: {
                code: 'UNAUTHENTICATED'
            }
        })
    }

    if (!await bcrypt.compare(oldPassword, user.password as string)) {
        throw new GraphQLError(constants.MESSAGES.INCORRECT_PASSWORD, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }

    const password: string = await bcrypt.hash(newPassword, 10)

    await userService.updateUserById(sub, { password })

    await userService.deleteAllSessions(sub)
}

interface oldNewPassword {
    oldPassword: string,
    newPassword: string
}

const refreshAuthTokens = async (token: string): Promise<authTokens> => {
    const { sub, role, device } = await tokenService.verifyToken(token, process.env.REFRESH_TOKEN_SECRET as string)

    if (!await userService.getUserById(sub)) {
        throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
            extensions: {
                code: 'NOT_FOUND'
            }
        })
    }

    const { sessionId } = await userService.validateSession({ userId: sub, device, token })

    const { accessToken, refreshToken } = await tokenService.generateAuthTokens({ sub, role, device })

    await userService.updateSessionById(sessionId, refreshToken)

    return { accessToken, refreshToken }
}

interface authTokens {
    accessToken: string,
    refreshToken: string
}

const logoutUser = async (token: string): Promise<void> => {
    const { sub, device } = await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)
    const session = await userService.getSessionByUserIdAndDevice(sub, device)

    if (!session) {
        throw new GraphQLError(constants.MESSAGES.NO_SESSION, {
            extensions: {
                code: 'CONFLICT'
            }
        })
    }

    await userService.deleteSessionById(session._id)
}

export default {
    registerUser,
    checkUserAlreadyExist,
    validateUserRole,
    loginUser,
    requestReset,
    verifyResetOtp,
    resetForgotPassword,
    resetPassword,
    refreshAuthTokens,
    logoutUser
}
