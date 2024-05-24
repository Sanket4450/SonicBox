import { Schema, InferSchemaType, model } from 'mongoose'

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    lastActive: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    autoIndex: false,
  }
)

type Session = InferSchemaType<typeof sessionSchema>

export default model<Session>('Session', sessionSchema)
