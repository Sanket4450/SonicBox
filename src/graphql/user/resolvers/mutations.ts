import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import userValidation from '../../../validations/user'
import libraryValidation from '../../../validations/library'
import fields from '../fields/mutations'
import constants from '../../../constants'
import authService from '../../../services/auth'
import userService from '../../../services/user'
import libraryService from '../../../services/library'

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

    updateUser: async (_: any, { input }: updateUserInput, { token }: any, info: GraphQLResolveInfo): Promise<updateUserData> => {
        try {
            validateSchema(input, userValidation.updateUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.updateUser)

            const user = await userService.updateUser(token, input)

            return {
                userId: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth,
                state: user.state,
                country: user.country,
                profile_picture: user.profile_picture,
                description: user.description,
                isVerified: user.isVerified
            }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    addLibraryPlaylist: async (_: any, { playlistId }: addRemoveLibraryPlaylist, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema({ playlistId }, libraryValidation.addRemoveLibraryPlaylist)

            validateSelection(info.fieldNodes[0].selectionSet, fields.addLibraryPlaylist)

            await libraryService.addLibraryPlaylist(token, playlistId)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    removeLibraryPlaylist: async (_: any, { playlistId }: addRemoveLibraryPlaylist, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema({ playlistId }, libraryValidation.addRemoveLibraryPlaylist)

            validateSelection(info.fieldNodes[0].selectionSet, fields.removeLibraryPlaylist)

            await libraryService.removeLibraryPlaylist(token, playlistId)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    addLibraryArtist: async (_: any, { artistId }: addRemoveLibraryArtist, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema({ artistId }, libraryValidation.addRemoveLibraryArtist)

            validateSelection(info.fieldNodes[0].selectionSet, fields.addLibraryArtist)

            await libraryService.addLibraryArtist(token, artistId)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    removeLibraryArtist: async (_: any, { artistId }: addRemoveLibraryArtist, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema({ artistId }, libraryValidation.addRemoveLibraryArtist)

            validateSelection(info.fieldNodes[0].selectionSet, fields.removeLibraryArtist)

            await libraryService.removeLibraryArtist(token, artistId)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    addLibraryAlbum: async (_: any, { albumId }: addRemoveLibraryAlbum, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema({ albumId }, libraryValidation.addRemoveLibraryAlbum)

            validateSelection(info.fieldNodes[0].selectionSet, fields.addLibraryAlbum)

            await libraryService.addLibraryAlbum(token, albumId)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    removeLibraryAlbum: async (_: any, { albumId }: addRemoveLibraryAlbum, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSchema({ albumId }, libraryValidation.addRemoveLibraryAlbum)

            validateSelection(info.fieldNodes[0].selectionSet, fields.removeLibraryAlbum)

            await libraryService.removeLibraryAlbum(token, albumId)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    deleteUser: async (_: any, __: any, { token }: any, info: GraphQLResolveInfo): Promise<{ success: true }> => {
        try {
            validateSelection(info.fieldNodes[0].selectionSet, fields.deleteUser)

            await userService.deleteUser(token)

            return { success: true }
        } catch (error: any) {
            throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                extensions: {
                    code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    },

    verifyUser: async (_: any, { input }: verifyUserInput, { token }: any, info: GraphQLResolveInfo): Promise<{ isVerified: boolean }> => {
        try {
            validateSchema(input, userValidation.verifyUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.verifyUser)

            await userService.verifyUser(token, input)

            return { isVerified: input.isVerified }
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

interface updateUserData {
    userId: string
    username: string
    name: string
    email: string
    gender: genderType
    dateOfBirth: string
    state: string
    country: string
    profile_picture: string
    description: string
    isVerified: boolean
}

interface addRemoveLibraryPlaylist {
    playlistId: string
}

interface addRemoveLibraryArtist {
    artistId: string
}

interface addRemoveLibraryAlbum {
    albumId: string
}

interface verifyUserInput {
    input: {
        userId: string
        isVerified: boolean
    }
}
