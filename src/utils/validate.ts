import Joi, { Schema } from 'joi'
import { GraphQLError, SelectionSetNode } from 'graphql'
import { extractFields } from './selection'
import constants from '../constants'

const schemaOptions = {
    errors: {
        wrap: {
            label: '',
        },
    },
}

export const validateSchema = (obj: object, schema: Schema): void => {
    const { error } = Joi.compile(schema).prefs({ errors: { label: 'key' }, abortEarly: false }).validate(obj, schemaOptions)

    if (error) {
        const message = error.details[0].message
        const path = error.details[0].path

        throw new GraphQLError(message, {
            path,
            extensions: {
                code: 'BAD_USER_INPUT'
            }
        })
    }
}

export const validateSelection = (selectionSet: SelectionSetNode | undefined, fieldSet: string[]): void => {
    const selectedFields = selectionSet ? extractFields(selectionSet) : []

    if (!fieldSet.every(field => selectedFields.includes(field))) {
        throw new GraphQLError(constants.MESSAGES.SELECT_REQUIRED_FIELDS, {
            extensions: {
                code: 'VALIDATION_FAILED'
            }
        })
    }
}
