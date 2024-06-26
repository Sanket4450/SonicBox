import Joi from 'joi'

import {
  dateValidation,
  emailValidation,
  integerNumberReqValidation,
  passwordValidation,
  stringReqValidation,
  stringValidation,
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
  profileImage: stringValidation,
  description: stringValidation,
})

const loginUser = Joi.object({
  username: stringValidation.alphanum().min(8).max(15),
  email: stringValidation.email().lowercase(),
  password: passwordValidation,
})

const requestReset = Joi.object({
  email: emailValidation,
})

const verifyResetOtp = Joi.object({
  otp: integerNumberReqValidation
    .min(10 ** 3)
    .max(10 ** 4 - 1)
    .messages({
      'number.min': 'OTP should be 4 digit',
      'number.max': 'OTP should be 4 digit',
    }),
  resetToken: stringReqValidation,
})

const resetForgotPassword = Joi.object({
  password: passwordValidation,
  resetToken: stringReqValidation,
})

const resetPassword = Joi.object({
  oldPassword: passwordValidation,
  newPassword: passwordValidation,
})

const refreshAuthTokens = Joi.object({
  token: stringReqValidation,
})

export default {
  createUser,
  loginUser,
  requestReset,
  verifyResetOtp,
  resetForgotPassword,
  resetPassword,
  refreshAuthTokens,
}
