import Joi from 'joi'
import {
    stringReqValidation,
    stringValidation,
    booleanValidation,
    idReqValidation,
    idValidation
} from './common'

const createPlaylist = Joi.object({
    name: stringReqValidation,
    image: stringValidation,
    description: stringValidation,
    isPrivate: booleanValidation
})

const updatePlaylist = Joi.object({
    playlistId: idReqValidation,
    input: {
        name: stringValidation,
        image: stringValidation,
        description: stringValidation,
        isPrivate: booleanValidation
    }
})

const addRemoveSong = Joi.object({
    playlistId: idReqValidation,
    songId: idReqValidation
})

export default {
    createPlaylist,
    updatePlaylist,
    addRemoveSong
}
