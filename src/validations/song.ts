import Joi from 'joi'
import {
    stringReqValidation,
    idReqValidation
} from './common'

const createSong = Joi.object({
    name: stringReqValidation,
    fileURL: stringReqValidation,
    albumId: idReqValidation
})

export default {
    createSong
}
