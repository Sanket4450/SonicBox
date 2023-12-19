import Joi from 'joi'
import {
    stringReqValidation,
    idReqValidation,
    arrayReqValidation,
    stringValidation,
    idValidation
} from './common'

const createSong = Joi.object({
    name: stringReqValidation,
    fileURL: stringReqValidation,
    albumId: idReqValidation,
    artists: arrayReqValidation.items(idReqValidation).min(1)
})

const updateSong = Joi.object({
    songId: idReqValidation,
    input: {
        name: stringValidation,
        fileURL: stringValidation,
        albumId: idValidation,
        addArtist: idValidation,
        removeArtist: idValidation
    }
})

export default {
    createSong,
    updateSong
}
