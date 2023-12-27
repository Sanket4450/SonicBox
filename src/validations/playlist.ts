import Joi from 'joi'
import {
    stringReqValidation,
    stringValidation,
    booleanValidation,
    idReqValidation,
    pageAndLimit
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

const deletePlaylist = Joi.object({
    playlistId: idReqValidation
})

const playlists = Joi.object({
    keyword: stringValidation,
    ...pageAndLimit
})

const playlist = Joi.object({
    id: idReqValidation
})

export default {
    createPlaylist,
    updatePlaylist,
    addRemoveSong,
    deletePlaylist,
    playlists,
    playlist
}
