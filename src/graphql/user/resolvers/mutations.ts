import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import fields from '../fields/mutations'
import constants from '../../../constants'
import authService from '../../../services/auth'
import tokenService from '../../../services/token'

const mutations = {
    createUser: async (_: any, { input }: userData, __: any, info: GraphQLResolveInfo): Promise<userIdAndTokens> => {
        try {
            validateSchema(input, authValidation.createUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createUser)

            const { userId, accessToken, refreshToken } = await authService.registerUser(input)

            return { userId, accessToken, refreshToken }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    loginUser: async (_: any, { input }: loginData, __: any, info: GraphQLResolveInfo): Promise<userIdAndTokens> => {
        try {
            validateSchema(input, authValidation.loginUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.loginUser)

            const { userId, accessToken, refreshToken } = await authService.loginUser(input)

            return { userId, accessToken, refreshToken }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    resetForgotPassword: async (_: any, { input }: passwordAndToken, __: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(input, authValidation.resetForgotPassword)

            validateSelection(info.fieldNodes[0].selectionSet, fields.resetForgotPassword)

            await authService.resetForgotPassword(input)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    logoutUser: async (_: any, { sessionId }: session, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema({ sessionId }, authValidation.logoutUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.logoutUser)

            await tokenService.verifyToken(token, process.env.ACCESS_TOKEN_SECRET || '')

            await authService.logoutUser(sessionId)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    }
}

interface userData {
    input: {
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
}

interface loginData {
    input: {
        username?: string,
        email?: string,
        password: string,
        deviceToken: string
    }
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
    userId: string,
    accessToken: string,
    refreshToken: string
}

interface passwordAndToken {
    input: {
        password: string,
        resetToken: string
    }
}

type session = {
    sessionId: string
}

export default mutations
