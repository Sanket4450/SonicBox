import Joi from 'joi'
import {
    idReqValidation,
    stringReqValidation,
    stringValidation
} from './common'

const createAlbum = Joi.object({
    name: stringReqValidation,
    image: stringReqValidation
})

const updateAlbum = Joi.object({
    albumId: idReqValidation,
    input: {
        artistId: stringValidation,
        name: stringValidation,
        image: stringValidation
    }
})

const deleteAlbum = Joi.object({
    albumId: idReqValidation
})

export default {
    createAlbum,
    updateAlbum,
    deleteAlbum
}
