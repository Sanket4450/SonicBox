import Joi from 'joi'
import {
    stringReqValidation,
    stringValidation,
    booleanValidation
} from './common'

const createPlaylist = Joi.object({
    name: stringReqValidation,
    image: stringValidation,
    isPrivate: booleanValidation
})

export default {
    createPlaylist
}
