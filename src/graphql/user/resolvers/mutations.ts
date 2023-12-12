import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import fields from '../fields/mutations'
import constants from '../../../constants'
import authService from '../../../services/auth'

const mutations = {
    createUser: async (_: any, { input }: userData, __: any, info: GraphQLResolveInfo): Promise<userIdAndTokens> => {

            validateSchema(input, authValidation.createUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.createUser)

            const user = await authService.registerUser(input)

            return {
                _id: user._id,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken
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

interface passwordAndToken {
    input: {
        password: string,
        resetToken: string
    }
}

export default mutations
