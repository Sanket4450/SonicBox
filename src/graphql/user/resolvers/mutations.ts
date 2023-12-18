import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import userValidation from '../../../validations/user'
import fields from '../fields/mutations'
import constants from '../../../constants'
import authService from '../../../services/auth'
import userService from '../../../services/user'

export default {
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

    resetPassword: async (_: any, { input }: resetPasswordInput, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(input, authValidation.resetPassword)

            validateSelection(info.fieldNodes[0].selectionSet, fields.resetPassword)

            await authService.resetPassword(token, input)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    logoutUser: async (_: any, __: any, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSelection(info.fieldNodes[0].selectionSet, fields.logoutUser)

            await authService.logoutUser(token)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    followUser: async (_: any, { input }: followUnfollowUser, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(input, userValidation.followUnfollowUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.followUser)

            await userService.followUser(token, input)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    unfollowUser: async (_: any, { input }: followUnfollowUser, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(input, userValidation.followUnfollowUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.unfollowUser)

            await userService.unfollowUser(token, input)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    updateUser: async (_: any, { input }: updateUserInput, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema(input, userValidation.updateUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.updateUser)

            await userService.updateUser(token, input)

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
        username: string
        name?: string
        email: string
        password: string
        gender?: genderType
        dateOfBirth?: string
        role?: roleType
        secret?: string
        state?: string
        country?: string
        profile_picture?: string
        description?: string
        deviceToken: string
    }
}

interface loginData {
    input: {
        username?: string
        email?: string
        password: string
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
    userId: string
    accessToken: string
    refreshToken: string
}

interface passwordAndToken {
    input: {
        password: string
        resetToken: string
    }
}

interface resetPasswordInput {
    input: {
        oldPassword: string
        newPassword: string
    }
}

interface followUnfollowUser {
    input: {
        userId: string
    }
}

interface updateUserInput {
    input: {
        username?: string
        name?: string
        email?: string
        gender?: genderType
        dateOfBirth?: string
        role?: roleType
        secret?: string
        state?: string
        country?: string
        profile_picture?: string
        description?: string
    }
}
