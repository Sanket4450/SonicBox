import Joi from 'joi'
import {
    arrayValidation,
    idValidation,
    stringReqValidation,
    stringValidation
} from './common'

const createCategory = Joi.object({
    name: stringReqValidation,
    image: stringValidation,
    description: stringValidation,
    parent_categoryId: idValidation,
    playlists: arrayValidation.items(idValidation)
})

export default {
    createCategory
}
