import Joi from 'joi'
import { stringReqValidation } from './common'

const createAlbum = Joi.object({
    name: stringReqValidation,
    image: stringReqValidation
})

export default {
    createAlbum
}
