import Joi from 'joi'

import {
    dateValidation,
    emailValidation,
    integerNumberReqValidation,
    passwordValidation,
    stringReqValidation,
    stringValidation
} from './common'

const createUser = Joi.object({
    username: stringReqValidation.alphanum().min(8).max(15),
    name: stringValidation,
    email: emailValidation,
    password: passwordValidation,
    gender: stringValidation.lowercase().valid('male', 'female', 'other'),
    dateOfBirth: dateValidation,
    role: stringValidation.lowercase().valid('user', 'artist', 'admin'),
    secret: stringValidation,
    state: stringValidation,
    country: stringValidation,
    profile_picture: stringValidation,
    description: stringValidation,
    deviceToken: stringReqValidation
})

const loginUser = Joi.object({
    username: stringValidation.alphanum().min(8).max(15),
    email: stringValidation.email().lowercase(),
    password: passwordValidation,
    deviceToken: stringReqValidation
})

const requestReset = Joi.object({
    email: emailValidation
})

const verifyResetOtp = Joi.object({
    otp: integerNumberReqValidation,
    resetToken: stringReqValidation
})

const resetForgotPassword = Joi.object({
    password: passwordValidation,
    resetToken: stringReqValidation
})

export default {
    createUser,
    loginUser,
    requestReset,
    verifyResetOtp,
    resetForgotPassword
}
