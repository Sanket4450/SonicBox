import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import userValidation from '../../../validations/user'
import fields from '../fields/queries'
import constants from '../../../constants'
import authService from '../../../services/auth'
import userService from '../../../services/user'

export default {
  requestReset: async (
    _: any,
    { input }: emailAndDevice,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<resetToken> => {
    try {
      validateSchema(input, authValidation.requestReset)

      validateSelection(info.fieldNodes[0].selectionSet, fields.requestReset)

      const resetToken = await authService.requestReset(input)

      return { resetToken }
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },

  verifyResetOtp: async (
    _: any,
    { input }: otpAndToken,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<{ success: true }> => {
    try {
      validateSchema(input, authValidation.verifyResetOtp)

      validateSelection(info.fieldNodes[0].selectionSet, fields.verifyResetOtp)

      await authService.verifyResetOtp(input)

      return { success: true }
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },

  refreshAuthTokens: async (
    _: any,
    { token }: token,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<authTokens> => {
    try {
      validateSchema({ token }, authValidation.refreshAuthTokens)

      validateSelection(
        info.fieldNodes[0].selectionSet,
        fields.refreshAuthTokens
      )

      const { accessToken, refreshToken } = await authService.refreshAuthTokens(
        token
      )

      return { accessToken, refreshToken }
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },

  users: async (
    _: any,
    { input }: usersInput,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<user[]> => {
    try {
      validateSchema(input, userValidation.users)

      validateSelection(info.fieldNodes[0].selectionSet, fields.users)

      const users = await userService.getUsers(input)

      return users
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },

  user: async (
    _: any,
    { id }: id,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<user> => {
    try {
      validateSchema({ id }, userValidation.user)

      validateSelection(info.fieldNodes[0].selectionSet, fields.user)

      const [user] = await userService.getSingleUser(id)

      if (!user) {
        throw new GraphQLError(constants.MESSAGES.USER_NOT_FOUND, {
          extensions: {
            code: 'NOT_FOUND',
          },
        })
      }
      return user
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },

  profile: async (
    _: any,
    __: any,
    { token }: any,
    info: GraphQLResolveInfo
  ): Promise<user> => {
    try {
      validateSelection(info.fieldNodes[0].selectionSet, fields.user)

      const [user] = await userService.getProfile(token)

      return user
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },

  artists: async (
    _: any,
    { input }: artistsInput,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<artist[]> => {
    try {
      validateSchema(input, userValidation.artists)

      validateSelection(info.fieldNodes[0].selectionSet, fields.artists)

      const artists = await userService.getArtists(input)

      return artists
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },

  artist: async (
    _: any,
    { id }: id,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<artist> => {
    try {
      validateSchema({ id }, userValidation.artist)

      validateSelection(info.fieldNodes[0].selectionSet, fields.artist)

      const [artist] = await userService.getSingleArtist(id)

      if (!artist) {
        throw new GraphQLError(constants.MESSAGES.ARTIST_NOT_EXIST, {
          extensions: {
            code: 'NOT_FOUND',
          },
        })
      }
      return artist
    } catch (error: any) {
      throw new GraphQLError(
        error.message || constants.MESSAGES.SOMETHING_WENT_WRONG,
        {
          extensions: {
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          },
        }
      )
    }
  },
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
  userId: string
  username: string
  name: string
  email: string
  gender: string
  dateOfBirth: string
  state: string
  country: string
  profile_picture: string
  description: string
  isVerified: boolean
  followingsCount: number
  followersCount: number
}

interface id {
  id: string
}

interface artistsInput {
  input: {
    keyword?: string
    page?: number
    limit?: number
  }
}

interface artist {
  artistId: string
  username: string
  name: string
  gender: string
  dateOfBirth: string
  state: string
  country: string
  profile_picture: string
  description: string
  isVerified: boolean
  followingsCount: number
  followersCount: number
}
