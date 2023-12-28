import Joi from 'joi'
import {
    arrayValidation,
    idValidation,
    stringReqValidation,
    stringValidation,
    idReqValidation,
    pageAndLimit,
    booleanValidation
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
        description: stringValidation
    }
})

const addRemovePlaylist = Joi.object({
    categoryId: idReqValidation,
    playlistId: idReqValidation,
    isAdded: booleanValidation.required()
})

const deleteCategory = Joi.object({
    categoryId: idReqValidation
})

const categories = Joi.object({
    ...pageAndLimit
})

const category = Joi.object({
    id: idReqValidation
})

export default {
    createCategory,
    updateCategory,
    addRemovePlaylist,
    deleteCategory,
    categories,
    category
}
