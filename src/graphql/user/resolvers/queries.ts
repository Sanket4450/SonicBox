import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import userValidation from '../../../validations/user'
import fields from '../fields/queries'
import constants from '../../../constants'
import authService from '../../../services/auth'
import userService from '../../../services/user'

export default {
    requestReset: async (_: any, { input }: emailAndDevice, __: any, info: GraphQLResolveInfo): Promise<resetToken> => {
        try {
            validateSchema(input, authValidation.requestReset)

            validateSelection(info.fieldNodes[0].selectionSet, fields.requestReset)

            const resetToken = await authService.requestReset(input)

            return { resetToken }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    verifyResetOtp: async (_: any, { input }: otpAndToken, __: any, info: GraphQLResolveInfo): Promise<{success: true}> => {
        try {
            validateSchema(input, authValidation.verifyResetOtp)

            validateSelection(info.fieldNodes[0].selectionSet, fields.verifyResetOtp)

            await authService.verifyResetOtp(input)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    refreshAuthTokens: async (_: any, { token }: token, __: any, info: GraphQLResolveInfo): Promise<authTokens> => {
        try {
            validateSchema({ token }, authValidation.refreshAuthTokens)

            validateSelection(info.fieldNodes[0].selectionSet, fields.refreshAuthTokens)

            const { accessToken, refreshToken } = await authService.refreshAuthTokens(token)

            return { accessToken, refreshToken }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    users: async (_: any, { input }: usersInput, __: any, info: GraphQLResolveInfo): Promise<user[]> => {
        try {
            validateSchema(input, userValidation.users)

            validateSelection(info.fieldNodes[0].selectionSet, fields.users)

            const users = await userService.getUsers(input)

            return users
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    }
}

interface emailAndDevice {
    input: {
        email: string
        deviceToken: string
    }
}

type resetToken = {
    resetToken: string
}

interface otpAndToken {
    input: {
        otp: number
        resetToken: string
    }
}

type token = {
    token: string
}

interface authTokens {
    accessToken: string
    refreshToken: string
}

interface usersInput {
    input: {
        keyword?: string
        page?: number
        limit?: number
    }
}

interface user {
    userId: string,
    username: string,
    name: string,
    email: string,
    gender: string,
    dateOfBirth: string,
    state: string,
    country: string,
    profile_picture: string,
    description: string,
    isVerified: boolean,
    followingsCount: number,
    followersCount: number
}
