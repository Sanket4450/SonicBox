import Joi from 'joi'
import {
    arrayValidation,
    idValidation,
    stringReqValidation,
    stringValidation,
    idReqValidation
} from './common'

const createCategory = Joi.object({
    name: stringReqValidation,
    image: stringValidation,
    description: stringValidation,
    parent_categoryId: idValidation,
    playlists: arrayValidation.items(idValidation)
})

const updateCategory = Joi.object({
    categoryId: idReqValidation,
    input: {
        name: stringValidation,
        image: stringValidation,
        description: stringValidation,
        addPlaylist: idValidation,
        removePlaylist: idValidation
    }
})

export default {
    createCategory,
    updateCategory
}
