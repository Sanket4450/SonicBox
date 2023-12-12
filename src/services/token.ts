import jwt, { JwtPayload } from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import constants from '../constants'

interface tokenType {
    payload: {
        sub: string,
        role: roleType
    },
    secret: string,
    options: {
        expiresIn: string
    }
}

enum roleType {
    USER = 'user',
    ARTIST = 'artist',
    ADMIN = 'admin'
}

const generateToken = ({ payload, secret, options }: tokenType): string => {
    return jwt.sign(payload, secret, options)
}

const verifyToken = (token: string, secret: string): any => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    throw new GraphQLError(constants.MESSAGES.AUTHENTICATION_FAILED, {
                        extensions: {
                            code: 'UNAUTHENTICATED'
                        }
                    })
                }
                throw new GraphQLError(err.message, {
                    extensions: {
                        code: 'UNAUTHENTICATED'
                    }
                })
            } else {
                resolve(decoded)
            }
        })
    })
}

const generateAuthTokens = async (userId: string, role: roleType = roleType.USER): Promise<authTokens> => {
    const payload = {
        sub: userId,
        role
    }
    const accessToken = generateToken({
        payload,
        secret: process.env.ACCESS_TOKEN_SECRET || '',
        options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '' }
    })
    const refreshToken = generateToken({
        payload,
        secret: process.env.REFRESH_TOKEN_SECRET || '',
        options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '' }
    })

    return {
        accessToken,
        refreshToken
    }
}

interface authTokens {
    accessToken: string,
    refreshToken: string
}

export default {
    generateToken,
    generateAuthTokens,
    verifyToken
}
