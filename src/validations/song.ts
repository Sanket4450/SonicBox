import Joi from 'joi'
import {
    stringReqValidation,
    idReqValidation,
    arrayValidation
} from './common'

const createSong = Joi.object({
    name: stringReqValidation,
    fileURL: stringReqValidation,
    albumId: idReqValidation,
    artists: arrayValidation.items(idReqValidation).min(1)
})

export default {
    createSong
}
