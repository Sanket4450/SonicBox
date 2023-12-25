import { GraphQLError } from 'graphql'
import { validateSchema } from '../../../utils/validate'
import { pageAndLimitSchema } from '../../../validations/common'
import constants from '../../../constants'
import userService from '../../../services/user'

export default {
    SingleUser: {
        followings: async ({ userId }: any, { page, limit }: pageAndLimit, __: any): Promise<user[]> => {
            try {
                validateSchema({ page, limit }, pageAndLimitSchema)

                const followings = await userService.getUserFollowings(userId)

                return followings
            } catch (error: any) {
                throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                    extensions: {
                        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                    }
                })
            }
        },

        followers: async ({ userId }: any, { page, limit }: pageAndLimit, __: any): Promise<user[]> => {
            try {
                validateSchema({ page, limit }, pageAndLimitSchema)

                const followers = await userService.getUserFollowers(userId)

                return followers
            } catch (error: any) {
                throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
                    extensions: {
                        code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
                    }
                })
            }
        }
    }
}

interface pageAndLimit {
    page: string
    limit: string
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
