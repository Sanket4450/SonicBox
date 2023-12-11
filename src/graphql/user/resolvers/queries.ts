import { GraphQLResolveInfo, GraphQLError } from 'graphql'
import { validateSchema, validateSelection } from '../../../utils/validate'
import authValidation from '../../../validations/auth'
import { extractFields } from '../../../utils/selection'
import fields from '../fields/queries'
import constants from '../../../constants'
import authService from '../../../services/auth'
import tokenService from '../../../services/token'

const queries = {
    loginUser: async (_: any, { input }: userData, __: any, info: GraphQLResolveInfo): Promise<userIdAndTokens> => {
        try {
            validateSchema(input, authValidation.loginUser)

            validateSelection(info.fieldNodes[0].selectionSet, fields.loginUser)

            const { _id, role } = await authService.loginUser(input)

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
    }
}

interface userData {
    input: {
        username?: string,
        email?: string,
        password: string
    }
}

interface userIdAndTokens {
    _id: string,
    accessToken: string,
    refreshToken: string
}

export default queries
