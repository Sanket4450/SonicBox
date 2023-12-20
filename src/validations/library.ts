import Joi from 'joi'

import { idReqValidation } from './common'

const addRemoveLibraryPlaylist = Joi.object({
    playlistId: idReqValidation,
})

const addRemoveLibraryArtist = Joi.object({
    artistId: idReqValidation
})

const addRemoveLibraryAlbum = Joi.object({
    albumId: idReqValidation,
})

export default {
    addRemoveLibraryPlaylist,
    addRemoveLibraryArtist,
    addRemoveLibraryAlbum
}
