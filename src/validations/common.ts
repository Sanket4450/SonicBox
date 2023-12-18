import Joi from 'joi'

export const stringValidation = Joi.string().trim()
export const stringReqValidation = stringValidation.required()
export const emailValidation = stringReqValidation.email().lowercase()
export const passwordValidation = stringReqValidation.min(8)
export const numberValidation = Joi.number()
export const numberReqValidation = numberValidation.required()
export const integerNumberValidation = numberValidation.integer()
export const integerNumberReqValidation = integerNumberValidation.required()
export const booleanValidation = Joi.boolean().strict(true)
export const dateValidation = Joi.date()
export const arrayValidation = Joi.array().required()

export const pageAndLimit = {
    page: integerNumberValidation.min(1),
    limit: integerNumberValidation.min(1)
}

export const secretValidation = stringValidation
    .pattern(new RegExp('^[A-Za-z0-9_@/?%]*$'))
    .messages({ 'string.pattern.base': 'Invalid secret. Secret does not match with the pattern' })

export const idValidation = stringValidation
    .pattern(new RegExp('^[0-9a-fA-F]{24}$'))
    .messages({ 'string.pattern.base': 'Invalid ID. Please provide a valid ObjectId' })

export const idReqValidation = idValidation.required()

export const toggleValidation = [
    stringValidation.lowercase().valid('true', 'false'), numberValidation.valid(1, 0)
]
