import Joi from 'joi'

import {
    dateValidation,
    emailValidation,
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
    description: stringValidation
})

const loginUser = Joi.object({
    username: stringValidation.alphanum().min(8).max(15),
    email: stringValidation.email().lowercase(),
    password: passwordValidation,
})

export default {
    createUser,
    loginUser
}
