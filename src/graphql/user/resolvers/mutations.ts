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

            const { _id, role } = await authService.registerUser(input)

            const { accessToken, refreshToken } = await tokenService.generateAuthTokens(_id || '', role)

            return {
                _id,
                accessToken,
                refreshToken
            }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    resetPassword: async (_: any, { input }: passwordAndToken, __: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(input, authValidation.resetPassword)

            validateSelection(info.fieldNodes[0].selectionSet, fields.resetPassword)

            await authService.resetPassword(input)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions.code || 'INTERNAL_SERVER_ERROR'
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
        description?: string
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
