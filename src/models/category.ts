import { Schema, InferSchemaType, model } from 'mongoose'

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    parent_categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    playlists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
  },
  {
    timestamps: true,
    autoIndex: false,
  }
)

type Category = InferSchemaType<typeof categorySchema>

export default model<Category>('Category', categorySchema)
