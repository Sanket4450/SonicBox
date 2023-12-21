import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import constants from '../constants'

interface tokenType {
    payload: {
        sub: string
        role: roleType
        device: string
    }
    secret: string
    options: {
        expiresIn: string
    }
}

interface payload {
    sub: string
    role: roleType
    device: string
}

enum roleType {
    USER = 'user',
    ARTIST = 'artist',
    ADMIN = 'admin'
}

const generateToken = ({ payload, secret, options }: tokenType): string => {
    return jwt.sign(payload, secret, options)
}

const generateAuthTokens = async (payload: payload): Promise<authTokens> => {
    try {
        const accessToken = generateToken({
            payload,
            secret: process.env.ACCESS_TOKEN_SECRET as string,
            options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string }
        })
        const refreshToken = generateToken({
            payload,
            secret: process.env.REFRESH_TOKEN_SECRET as string,
            options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string }
        })

        return {
            accessToken,
            refreshToken
        }
    } catch (error: any) {
        throw new GraphQLError(error.message || constants.MESSAGES.SOMETHING_WENT_WRONG, {
            extensions: {
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR'
            }
        })
    }
}

interface authTokens {
    accessToken: string
    refreshToken: string
}

const verifyToken = (token: string, secret: string): any => {
    if (!token) {
        throw new GraphQLError(constants.MESSAGES.TOKEN_IS_REQUIRED, {
            extensions: {
                code: 'FORBIDDEN'
            }
        })
    }
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (error: any, decoded: any) => {
            if (error) {
                if (error instanceof jwt.JsonWebTokenError) {
                    throw new GraphQLError(constants.MESSAGES.INVALID_TOKEN, {
                        extensions: {
                            code: 'UNAUTHENTICATED'
                        }
                    })
                }
                if (error instanceof jwt.TokenExpiredError) {
                    throw new GraphQLError(constants.MESSAGES.TOKEN_EXPIRED, {
                        extensions: {
                            code: 'UNAUTHENTICATED'
                        }
                    })
                }
                throw new GraphQLError(error.message, {
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

export default {
    generateToken,
    generateAuthTokens,
    verifyToken
}
