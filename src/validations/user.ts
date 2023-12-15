import Joi from 'joi'
import { idReqValidation } from './common'

const followUser = Joi.object({
    userId: idReqValidation
})

export default {
    followUser
}
