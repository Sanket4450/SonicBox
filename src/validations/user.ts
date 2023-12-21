import Joi from 'joi'
import {
    idReqValidation,
    stringValidation,
    dateValidation,
    pageAndLimit
} from './common'

const followUnfollowUser = Joi.object({
    userId: idReqValidation
})

const updateUser = Joi.object({
    username: stringValidation.alphanum().min(8).max(15),
    name: stringValidation,
    email: stringValidation.email().lowercase(),
    gender: stringValidation.lowercase().valid('male', 'female', 'other'),
    dateOfBirth: dateValidation,
    role: stringValidation.lowercase().valid('user', 'artist', 'admin'),
    secret: stringValidation,
    state: stringValidation,
    country: stringValidation,
    profile_picture: stringValidation,
    description: stringValidation,
})

const users = Joi.object({
    keyword: stringValidation,
    ...pageAndLimit
})

const user = Joi.object({
    userId: idReqValidation
})

export default {
    followUnfollowUser,
    updateUser,
    users,
    user
}
