import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import fields from '../fields/queries'
import constants from '../../../constants'
import authService from '../../../services/auth'

const queries = {
    loginUser: async (_: any, { input }: userData, __: any, info: GraphQLResolveInfo): Promise<userIdAndTokens> => {
        try {
            validateSchema(input, authValidation.loginUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.loginUser)

            const user = await authService.loginUser(input)

            return {
                _id: user._id,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken
            }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    requestReset: async (_: any, { email }: email, __: any, info: GraphQLResolveInfo): Promise<resetToken> => {
        try {
            validateSchema({ email }, authValidation.requestReset)

            validateSelection(info.fieldNodes[0].selectionSet, fields.requestReset)

            const resetToken = await authService.requestReset(email)

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
}

interface userData {
    input: {
        username?: string,
        email?: string,
        password: string,
        deviceToken: string
    }
}

interface userIdAndTokens {
    _id: string,
    accessToken: string,
    refreshToken: string
}

type email = {
    email: string
}

type resetToken = {
    resetToken: string,
}

interface otpAndToken {
    input: {
        otp: number,
        resetToken: string
    }
}

type token = {
    token: string
}

interface authTokens {
    accessToken: string,
    refreshToken: string
}

export default queries
