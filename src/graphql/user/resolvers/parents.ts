import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import { pageAndLimitSchema } from '../../../validations/common'
import fields from '../fields/parents'
import constants from '../../../constants'
import userService from '../../../services/user'

export default {
    SingleUser: {
        followings: async ({ userId }: any, { page, limit }: pageAndLimit, __: any, info: GraphQLResolveInfo): Promise<user[]> => {
            try {
                validateSchema({ page, limit }, pageAndLimitSchema)

                validateSelection(info.fieldNodes[0].selectionSet, fields.users)

                const followings = await userService.getUserFollowings(userId)
                console.log(followings)
                return followings
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
