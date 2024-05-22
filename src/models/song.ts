import { Schema, InferSchemaType, model } from 'mongoose'

const songSchema = new Schema(
  {
    albumId: {
      type: Schema.Types.ObjectId,
      ref: 'Album',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    fileURL: {
      type: String,
      trim: true,
      required: true,
    },
    artists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    listens: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
)

type Song = InferSchemaType<typeof songSchema>

export default model<Song>('Song', songSchema)
