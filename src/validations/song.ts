import Joi from 'joi'
import {
    stringReqValidation,
    idReqValidation,
    arrayReqValidation
} from './common'

const createSong = Joi.object({
    name: stringReqValidation,
    fileURL: stringReqValidation,
    albumId: idReqValidation,
    artists: arrayReqValidation.items(idReqValidation).min(1)
})

export default {
    createSong
}
