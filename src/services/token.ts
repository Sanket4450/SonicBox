import jwt from 'jsonwebtoken'
import userService from './user'

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
    user = 'user',
    artist = 'artist',
    admin = 'admin'
}

const generateToken = ({ payload, secret, options }: tokenType) => {
    return jwt.sign(payload, secret, options)
}

// const verifyToken = (token, secret) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, secret, (err, decoded) => {
//             if (err) {
//                 if (err.name === 'JsonWebTokenError') {
//                     reject(new ApiError(constant.MESSAGES.AUTHENTICATION_FAILED, httpStatus.UNAUTHORIZED))
//                 }
//                 reject(new ApiError(err.message, httpStatus.UNAUTHORIZED))
//             } else {
//                 resolve(decoded)
//             }
//         })
//     })
// }

const generateAuthTokens = async (userId: string, role: roleType = roleType.user): Promise<{ accessToken: string, refreshToken: string }> => {
    const payload = {
        sub: userId,
        role: role
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
    await userService.updateUserById(userId, { token: refreshToken })

    return {
        accessToken,
        refreshToken
    }
}

export default {
    generateToken,
    generateAuthTokens
}
