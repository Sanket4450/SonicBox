import authService from '../../../services/auth'
import tokenService from '../../../services/token'

const mutations = {
    createUser: async (parent: undefined, args: userData): Promise<getUserAndTokens> => {
        const user = await authService.registerUser(args)

        user.id = user._id

        const tokens = await tokenService.generateAuthTokens(user.id || '', user.role)

        return {
            user,
            tokens
        }
    }
}

interface userData {
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

interface getUserData {
    id?: string,
    _id?: string,
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
    isVerified?: boolean,
    token: string | null
}

enum genderType {
    male = 'male',
    female = 'female',
    other = 'other'
}

enum roleType {
    user = 'user',
    artist = 'artist',
    admin = 'admin'
}

interface getUserAndTokens {
    user: getUserData,
    tokens: {
        accessToken: string,
        refreshToken: string
    }
}

export default mutations
