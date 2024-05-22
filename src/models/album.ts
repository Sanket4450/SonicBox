import { Schema, InferSchemaType, model } from 'mongoose'

const albumSchema = new Schema(
  {
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
)

type Album = InferSchemaType<typeof albumSchema>

export default model<Album>('Album', albumSchema)
