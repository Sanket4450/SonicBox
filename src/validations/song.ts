import Joi from 'joi'
import {
  stringReqValidation,
  idReqValidation,
  arrayReqValidation,
  stringValidation,
  idValidation,
  pageAndLimit,
} from './common'

const createSong = Joi.object({
  name: stringReqValidation,
  fileURL: stringReqValidation,
  albumId: idReqValidation,
  artists: arrayReqValidation.items(idReqValidation).min(1),
})

const updateSong = Joi.object({
  songId: idReqValidation,
  input: {
    name: stringValidation,
    fileURL: stringValidation,
    albumId: idValidation,
    addArtist: idValidation,
    removeArtist: idValidation,
  },
})

const deleteSong = Joi.object({
  songId: idReqValidation,
})

const songs = Joi.object({
  keyword: stringValidation,
  ...pageAndLimit,
})

const song = Joi.object({
  id: idReqValidation,
})

export default {
  createSong,
  updateSong,
  deleteSong,
  songs,
  song,
}
