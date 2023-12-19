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
    isPrivate: booleanValidation
})

const updatePlaylist = Joi.object({
    playlistId: idReqValidation,
    input: {
        name: stringValidation,
        image: stringValidation,
        description: stringValidation,
        isPrivate: booleanValidation,
        addSong: idValidation,
        removeSong: idValidation
    }
})

export default {
    createPlaylist,
    updatePlaylist
}
