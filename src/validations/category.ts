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
        description: stringValidation
    }
})

const addRemovePlaylist = Joi.object({
    categoryId: idReqValidation,
    playlistId: idReqValidation
})

const deleteCategory = Joi.object({
    categoryId: idReqValidation
})

export default {
    createCategory,
    updateCategory,
    addRemovePlaylist,
    deleteCategory
}
