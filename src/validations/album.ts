import Joi from 'joi'
import {
  idReqValidation,
  stringReqValidation,
  stringValidation,
  pageAndLimit,
} from './common'

const createAlbum = Joi.object({
  name: stringReqValidation,
  image: stringReqValidation,
})

const updateAlbum = Joi.object({
  albumId: idReqValidation,
  input: {
    artistId: stringValidation,
    name: stringValidation,
    image: stringValidation,
  },
})

const deleteAlbum = Joi.object({
  albumId: idReqValidation,
})

const albums = Joi.object({
  keyword: stringValidation,
  ...pageAndLimit,
})

const album = Joi.object({
  id: idReqValidation,
})

export default {
  createAlbum,
  updateAlbum,
  deleteAlbum,
  albums,
  album,
}
