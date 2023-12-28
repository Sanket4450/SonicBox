import Joi from 'joi'

import { booleanValidation, idReqValidation } from './common'

const addRemoveLibraryPlaylist = Joi.object({
    playlistId: idReqValidation,
    isAdded: booleanValidation.required()
})

const addRemoveLibraryArtist = Joi.object({
    artistId: idReqValidation,
    isAdded: booleanValidation.required()
})

const addRemoveLibraryAlbum = Joi.object({
    albumId: idReqValidation,
    isAdded: booleanValidation.required()
})

export default {
    addRemoveLibraryPlaylist,
    addRemoveLibraryArtist,
    addRemoveLibraryAlbum
}
